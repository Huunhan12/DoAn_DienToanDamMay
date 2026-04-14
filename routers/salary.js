const express = require('express');
const router = express.Router();
const NhanVien = require('../models/nhanvien');
const ChamCong = require('../models/chamcong');
const moment = require('moment');
const ExcelJS = require('exceljs');

// Middleware kiểm tra đăng nhập
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/dangnhap');
};

// Lấy danh sách lương
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        let query = {};
        const selectedMonth = req.query.month || moment().format('YYYY-MM');
        
        // Nếu là role 'user', chỉ hiện lương của chính mình
        if (req.session.user.vaiTro === 'user') {
            if (!req.session.user.nhanVien) {
                req.flash('error_msg', 'Tài khoản chưa liên kết nhân viên');
                return res.redirect('/');
            }
            query = { _id: req.session.user.nhanVien };
        }

        const nhanviens = await NhanVien.find(query).populate('phongBan chucVu');
        
        // Cấu hình thời gian dựa trên tháng đã chọn
        const startOfMonth = moment(selectedMonth, 'YYYY-MM').startOf('month').toDate();
        const endOfMonth = moment(selectedMonth, 'YYYY-MM').endOf('month').toDate();

        // Tính toán lương cho từng nhân viên dựa trên ngày công trong tháng đó
        const listSalary = await Promise.all(nhanviens.map(async (nv) => {
            const ngayCong = await ChamCong.countDocuments({
                nhanVien: nv._id,
                ngayChamCong: { $gte: startOfMonth, $lte: endOfMonth },
                trangThai: { $in: ['Có mặt', 'Đi trễ'] }
            });

            const heSo = nv.chucVu ? nv.chucVu.heSoLuong : 1;
            const thucNhanPhuCap = ngayCong > 15 ? nv.phuCap : 0;
            const tongLuong = Math.round(((nv.luongCoBan * heSo) / 26) * ngayCong + thucNhanPhuCap);
            
            return {
                ...nv._doc,
                ngayCong,
                phuCapGoc: nv.phuCap, // Lưu lại phụ cấp gốc để hiển thị nếu cần
                phuCap: thucNhanPhuCap, // Ghi đè phuCap bằng số tiền thực nhận
                tongLuong
            };
        }));

        res.render('luong', { 
            title: req.session.user.vaiTro === 'user' ? 'Phiếu Lương Cá Nhân' : 'Bảng Lương Nhân Viên', 
            data: listSalary,
            currentRoute: 'salary',
            selectedMonth // Gửi lại tháng đã chọn về view
        });
    } catch (err) {
        console.error(err);
        res.render('error', { errorMsg: 'Lỗi tải bảng lương' });
    }
});

// Xuất dữ liệu ra file Excel theo tháng (Chỉ dành cho Admin)
router.get('/export', ensureAuthenticated, async (req, res) => {
    if (req.session.user.vaiTro !== 'admin') {
        return res.status(403).send('Quyền truy cập bị từ chối');
    }
    try {
        const selectedMonth = req.query.month || moment().format('YYYY-MM');
        const nhanviens = await NhanVien.find().populate('phongBan chucVu');
        
        const startOfMonth = moment(selectedMonth, 'YYYY-MM').startOf('month').toDate();
        const endOfMonth = moment(selectedMonth, 'YYYY-MM').endOf('month').toDate();

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bang Luong Month ' + selectedMonth);

        worksheet.columns = [
            { header: 'Mã NV', key: 'maNV', width: 10 },
            { header: 'Họ Tên', key: 'hoTen', width: 25 },
            { header: 'Phòng Ban', key: 'phongBan', width: 20 },
            { header: 'Chức Vụ', key: 'chucVu', width: 20 },
            { header: 'Số Ngày Công', key: 'ngayCong', width: 15 },
            { header: 'Lương Cơ Bản', key: 'luongCoBan', width: 15 },
            { header: 'Phụ Cấp', key: 'phuCap', width: 15 },
            { header: 'Tổng Thực Nhận', key: 'tongLuong', width: 15 }
        ];

        for (const nv of nhanviens) {
            const ngayCong = await ChamCong.countDocuments({
                nhanVien: nv._id,
                ngayChamCong: { $gte: startOfMonth, $lte: endOfMonth },
                trangThai: { $in: ['Có mặt', 'Đi trễ'] }
            });

            const heSo = nv.chucVu ? nv.chucVu.heSoLuong : 1;
            const thucNhanPhuCap = ngayCong > 15 ? nv.phuCap : 0;
            const tongLuong = Math.round(((nv.luongCoBan * heSo) / 26) * ngayCong + thucNhanPhuCap);

            worksheet.addRow({
                maNV: nv.maNV,
                hoTen: nv.hoTen,
                phongBan: nv.phongBan ? nv.phongBan.tenPhongBan : '',
                chucVu: nv.chucVu ? nv.chucVu.tenChucVu : '',
                ngayCong: ngayCong,
                luongCoBan: nv.luongCoBan,
                phuCap: thucNhanPhuCap,
                tongLuong: tongLuong
            });
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=BangLuong_${selectedMonth}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi xuất file Excel');
    }
});

// Xuất Phiếu lương cá nhân (Giao diện in ấn)
router.get('/phieu-luong/:id', ensureAuthenticated, async (req, res) => {
    try {
        // Chỉ admin hoặc chính nhân viên đó mới được xem phiếu lương
        if (req.session.user.vaiTro !== 'admin' && req.session.user.nhanVien?.toString() !== req.params.id) {
            req.flash('error_msg', 'Bạn không có quyền truy cập');
            return res.redirect('/');
        }

        const nv = await NhanVien.findById(req.params.id).populate('phongBan chucVu');
        if (!nv) {
            req.flash('error_msg', 'Không tìm thấy nhân viên');
            return res.redirect('/salary');
        }

        const selectedMonth = req.query.month || moment().format('YYYY-MM');
        const startOfMonth = moment(selectedMonth, 'YYYY-MM').startOf('month').toDate();
        const endOfMonth = moment(selectedMonth, 'YYYY-MM').endOf('month').toDate();

        const ngayCong = await ChamCong.countDocuments({
            nhanVien: nv._id,
            ngayChamCong: { $gte: startOfMonth, $lte: endOfMonth },
            trangThai: { $in: ['Có mặt', 'Đi trễ'] }
        });

        const heSo = nv.chucVu ? nv.chucVu.heSoLuong : 1;
        const thucNhanPhuCap = ngayCong > 15 ? nv.phuCap : 0;
        const tongLuong = Math.round(((nv.luongCoBan * heSo) / 26) * ngayCong + thucNhanPhuCap);

        res.render('export_phieu_luong', {
            title: 'BẢNG LƯƠNG NHÂN VIÊN',
            nv,
            ngayCong,
            heSo,
            thucNhanPhuCap, // Rename key to avoid conflict or scope issues
            tongLuong,
            thang: moment(selectedMonth).format('MM/YYYY'),
            ngayXuat: moment().format('DD/MM/YYYY')
        });
    } catch (err) {
        console.error(err);
        res.redirect('/salary');
    }
});

module.exports = router;
