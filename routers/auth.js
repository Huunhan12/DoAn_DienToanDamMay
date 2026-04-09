const express = require('express');
const router = express.Router();
const TaiKhoan = require('../models/taikhoan');

// Giao diện Đăng nhập
router.get('/dangnhap', (req, res) => {
    res.render('dangnhap', { title: 'Đăng Nhập | Quản Lý Nhân Sự' });
});

// Xử lý Đăng nhập
router.post('/dangnhap', async (req, res) => {
    const { tenDangNhap, matKhau } = req.body;
    try {
        const user = await TaiKhoan.findOne({ tenDangNhap });

        if (!user) {
            req.flash('error_msg', 'Tài khoản không tồn tại');
            return res.redirect('/auth/dangnhap');
        }

        const isMatch = await user.matchPassword(matKhau);
        if (isMatch) {
            if (!user.trangThai) {
                req.flash('error_msg', 'Tài khoản đã bị khóa');
                return res.redirect('/auth/dangnhap');
            }
            req.session.user = user;
            req.flash('success_msg', 'Đăng nhập thành công');
            res.redirect('/');
        } else {
            req.flash('error_msg', 'Sai mật khẩu');
            res.redirect('/auth/dangnhap');
        }
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi hệ thống');
        res.redirect('/auth/dangnhap');
    }
});

// Đăng xuất
router.get('/dangxuat', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/auth/dangnhap');
        }
    });
});

// Middleware kiểm tra đăng nhập
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/dangnhap');
};

// Giao diện Đổi mật khẩu
router.get('/doimatkhau', ensureAuthenticated, (req, res) => {
    res.render('doimatkhau', { title: 'Đổi Mật Khẩu | Quản Lý Nhân Sự' });
});

// Xử lý Đổi mật khẩu
router.post('/doimatkhau', ensureAuthenticated, async (req, res) => {
    const { matKhauCu, matKhauMoi, xacNhanMatKhau } = req.body;
    
    try {
        const user = await TaiKhoan.findById(req.session.user._id);
        
        // 1. Kiểm tra mật khẩu cũ
        const isMatch = await user.matchPassword(matKhauCu);
        if (!isMatch) {
            req.flash('error_msg', 'Mật khẩu hiện tại không chính xác');
            return res.redirect('/auth/doimatkhau');
        }

        // 2. Kiểm tra mật khẩu mới và xác nhận
        if (matKhauMoi !== xacNhanMatKhau) {
            req.flash('error_msg', 'Mật khẩu mới và xác nhận không khớp');
            return res.redirect('/auth/doimatkhau');
        }

        if (matKhauMoi.length < 6) {
            req.flash('error_msg', 'Mật khẩu mới phải có ít nhất 6 ký tự');
            return res.redirect('/auth/doimatkhau');
        }

        // 3. Cập nhật mật khẩu mới
        user.matKhau = matKhauMoi;
        await user.save(); // Schema hook sẽ tự động hash mật khẩu

        req.flash('success_msg', 'Đổi mật khẩu thành công!');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi hệ thống khi đổi mật khẩu');
        res.redirect('/auth/doimatkhau');
    }
});

module.exports = router;
