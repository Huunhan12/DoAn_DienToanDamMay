const express = require('express');
const router = express.Router();
const ChamCong = require('../models/chamcong');
const NhanVien = require('../models/nhanvien');
const moment = require('moment');

// Middleware kiểm tra đăng nhập
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/dangnhap');
};

// Lấy thông tin chấm công cho một ngày cụ thể
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const date = req.query.date || moment().format('YYYY-MM-DD');
        
        // Nếu là role 'user', hiện danh sách lịch sử chấm công của họ
        if (req.session.user.vaiTro === 'user') {
            if (!req.session.user.nhanVien) {
                req.flash('error_msg', 'Tài khoản chưa liên kết nhân viên');
                return res.redirect('/');
            }
            
            const history = await ChamCong.find({ nhanVien: req.session.user.nhanVien })
                .sort({ ngayChamCong: -1 })
                .limit(31); // 1 tháng gần nhất
                
            return res.render('chamcong_user', { 
                title: 'Lịch Sử Chấm Công Cá Nhân', 
                data: history 
            });
        }

        const startOfDay = moment(date).startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();

        // Lấy danh sách tất cả nhân viên
        const nhanviens = await NhanVien.find({ trangThai: 'Đang làm việc' });
        
        // Lấy các bản ghi chấm công hiện có cho ngày này
        const attendanceRecords = await ChamCong.find({
            ngayChamCong: { $gte: startOfDay, $lte: endOfDay }
        });

        // Ánh xạ nhân viên với trạng thái chấm công của họ
        const list = nhanviens.map(nv => {
            const record = attendanceRecords.find(r => r.nhanVien.toString() === nv._id.toString());
            return {
                _id: nv._id,
                maNV: nv.maNV,
                hoTen: nv.hoTen,
                trangThai: record ? record.trangThai : 'Chưa chấm',
                ghiChu: record ? record.ghiChu : ''
            };
        });

        res.render('chamcong', { 
            title: 'Quản Lý Chấm Công', 
            data: list, 
            currentDate: date 
        });
    } catch (err) {
        console.error(err);
        res.render('error', { errorMsg: 'Lỗi tải trang chấm công' });
    }
});

// Cập nhật Chấm công (Chỉ dành cho Admin)
router.post('/update', ensureAuthenticated, async (req, res) => {
    if (req.session.user.vaiTro !== 'admin') {
        return res.status(403).send('Quyền truy cập bị từ chối');
    }
    // ... logic sigue ...
    try {
        const { date, attendance } = req.body;
        const submitDate = moment(date);
        
        // Kiểm tra xem ngày chấm công có lớn hơn ngày hiện tại không
        if (submitDate.isAfter(moment(), 'day')) {
            req.flash('error_msg', 'Không thể chấm công cho ngày trong tương lai!');
            return res.redirect(`/chamcong?date=${date}`);
        }

        const startOfDay = submitDate.startOf('day').toDate();
        const endOfDay = moment(date).endOf('day').toDate();

        // attendance là một đối tượng dạng { idNhanVien: { status, note } }
        for (const empId in attendance) {
            const { status, note } = attendance[empId];
            
            await ChamCong.findOneAndUpdate(
                { 
                    nhanVien: empId, 
                    ngayChamCong: { $gte: startOfDay, $lte: endOfDay } 
                },
                { 
                    nhanVien: empId,
                    ngayChamCong: moment(date).toDate(),
                    trangThai: status,
                    ghiChu: note
                },
                { upsert: true, new: true }
            );
        }

        req.flash('success_msg', 'Cập nhật chấm công thành công!');
        res.redirect(`/chamcong?date=${date}`);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi khi lưu chấm công');
        res.redirect('/chamcong');
    }
});

module.exports = router;
