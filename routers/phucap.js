const express = require('express');
const router = express.Router();
const NhanVien = require('../models/nhanvien');
const BangLuong = require('../models/bangluong');
const moment = require('moment');

// Middleware kiểm tra đăng nhập
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/dangnhap');
};

const requireAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.vaiTro === 'admin') {
        return next();
    }
    req.flash('error_msg', 'Bạn không có quyền cập nhật phụ cấp, chỉ có thể xem.');
    res.redirect('/phucap');
};

// GET /phucap - Danh sách phụ cấp nhân viên
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        let query = {};
        const selectedMonth = req.query.month || moment().format('YYYY-MM');

        if (req.session.user.vaiTro === 'user') {
            if (!req.session.user.nhanVien) {
                req.flash('error_msg', 'Tài khoản của bạn chưa liên kết nhân viên.');
                return res.redirect('/');
            }
            query = { _id: req.session.user.nhanVien };
        }
        
        const nhanviens = await NhanVien.find(query).populate('phongBan chucVu');
        
        // Cấu hình gắn dữ liệu BangLuong vào từng nhân viên
        const data = await Promise.all(nhanviens.map(async (nv) => {
            const bl = await BangLuong.findOne({ nhanVien: nv._id, thangNam: selectedMonth });
            return {
                ...nv._doc,
                tienXang: bl ? bl.tienXang : 0,
                tienCom: bl ? bl.tienCom : 0,
                tienCongTac: bl ? bl.tienCongTac : 0,
                phuCap: bl ? bl.phuCap : 0
            };
        }));

        res.render('phucap', {
            title: 'Quản Lý Phụ Cấp',
            data,
            selectedMonth,
            currentRoute: 'phucap'
        });
    } catch (err) {
        console.error(err);
        res.render('error', { errorMsg: 'Lỗi tải danh sách phụ cấp' });
    }
});

// POST /phucap/capnhat/:id - Cập nhật phụ cấp
router.post('/capnhat/:id', ensureAuthenticated, requireAdmin, async (req, res) => {
    try {
        const selectedMonth = req.query.month || moment().format('YYYY-MM');
        const tienXang = Number(req.body.tienXang) || 0;
        const tienCom = Number(req.body.tienCom) || 0;
        const tienCongTac = Number(req.body.tienCongTac) || 0;
        const phuCap = tienXang + tienCom + tienCongTac; // Tính lại tổng

        const nv = await NhanVien.findById(req.params.id);
        if(!nv) {
             req.flash('error_msg', 'Không tìm thấy nhân viên');
             return res.redirect('/phucap?month=' + selectedMonth);
        }

        await BangLuong.findOneAndUpdate(
            { nhanVien: req.params.id, thangNam: selectedMonth },
            { 
               $set: { 
                   tienXang, tienCom, tienCongTac, phuCap,
                   luongCoBan: nv.luongCoBan // Giữ base salary hiện tại nếu mới khởi tạo
               } 
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        
        req.flash('success_msg', 'Cập nhật phụ cấp tháng ' + selectedMonth + ' thành công!');
        res.redirect('/phucap?month=' + selectedMonth);
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi cập nhật');
        res.redirect('/phucap');
    }
});

module.exports = router;
