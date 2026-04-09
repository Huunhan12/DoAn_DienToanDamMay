const express = require('express');
const router = express.Router();
const TaiKhoan = require('../models/taikhoan');
const NhanVien = require('../models/nhanvien');

// Middleware kiểm tra quyền Admin
const ensureAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.vaiTro === 'admin') {
        return next();
    }
    req.flash('error_msg', 'Bạn không có quyền truy cập trang này');
    res.redirect('/');
};

// Danh sách Tài khoản
router.get('/', ensureAdmin, async (req, res) => {
    try {
        const list = await TaiKhoan.find().populate('nhanVien');
        
        // Tìm những nhân viên CHƯA có tài khoản
        const accounts = await TaiKhoan.find({}, 'nhanVien');
        const employeeIdsWithAccount = accounts.map(acc => acc.nhanVien).filter(id => id != null);
        
        const nhanviensWithoutAccount = await NhanVien.find({
            _id: { $nin: employeeIdsWithAccount }
        });

        res.render('taikhoan', { 
            title: 'Quản Lý Tài Khoản', 
            data: list,
            availableEmployees: nhanviensWithoutAccount
        });
    } catch (err) {
        console.error(err);
        res.render('error', { errorMsg: 'Lỗi tải danh sách tài khoản' });
    }
});

// Tạo tài khoản cho Nhân viên
router.post('/them', ensureAdmin, async (req, res) => {
    try {
        const { nhanVienId, tenDangNhap, matKhau, vaiTro } = req.body;
        
        const nv = await NhanVien.findById(nhanVienId);
        if (!nv) {
            req.flash('error_msg', 'Không tìm thấy nhân viên');
            return res.redirect('/taikhoan');
        }

        const newUser = new TaiKhoan({
            tenDangNhap,
            matKhau,
            hoTen: nv.hoTen,
            email: nv.email,
            vaiTro,
            nhanVien: nv._id
        });

        await newUser.save();
        req.flash('success_msg', 'Tạo tài khoản thành công!');
        res.redirect('/taikhoan');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi khi tạo tài khoản: ' + err.message);
        res.redirect('/taikhoan');
    }
});

// Thay đổi trạng thái (Khóa/Mở khóa)
router.post('/toggle/:id', ensureAdmin, async (req, res) => {
    try {
        const user = await TaiKhoan.findById(req.params.id);
        user.trangThai = !user.trangThai;
        await user.save();
        req.flash('success_msg', 'Đã cập nhật trạng thái tài khoản');
        res.redirect('/taikhoan');
    } catch (err) {
        res.redirect('/taikhoan');
    }
});

// Xóa Tài khoản
router.delete('/xoa/:id', ensureAdmin, async (req, res) => {
    try {
        await TaiKhoan.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Đã xóa tài khoản');
        res.redirect('/taikhoan');
    } catch (err) {
        res.redirect('/taikhoan');
    }
});

module.exports = router;
