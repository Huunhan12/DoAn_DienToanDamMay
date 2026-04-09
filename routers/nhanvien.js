const express = require('express');
const router = express.Router();
const NhanVien = require('../models/nhanvien');
const PhongBan = require('../models/phongban');
const ChucVu = require('../models/chucvu');


// Middleware kiểm tra đăng nhập
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/dangnhap');
};

// Lấy danh sách
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Nếu là role 'user', chỉ được xem chính mình
        if (req.session.user.vaiTro === 'user') {
            if (req.session.user.nhanVien) {
                return res.redirect('/nhanvien/chitiet/' + req.session.user.nhanVien);
            } else {
                req.flash('error_msg', 'Tài khoản của bạn chưa được liên kết với nhân viên nào.');
                return res.redirect('/');
            }
        }

        const list = await NhanVien.find().populate('phongBan chucVu');
        res.render('nhanvien', { 
            title: 'Quản Lý Nhân Viên', 
            data: list,
            currentRoute: 'nhanvien'
        });
    } catch (err) {
        console.error(err);
        res.render('error', { errorMsg: 'Lỗi tải danh sách nhân viên' });
    }
});

// Form Thêm mới
router.get('/them', ensureAuthenticated, async (req, res) => {
    try {
        const phongbans = await PhongBan.find();
        const chucvus = await ChucVu.find();
        res.render('nhanvien_them', { 
            title: 'Thêm Nhân Viên Mới', 
            phongbans, 
            chucvus 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/nhanvien');
    }
});

// Xử lý Thêm mới
router.post('/them', ensureAuthenticated, async (req, res) => {
    try {
        // Xử lý giá trị trống cho các trường ObjectId
        if (req.body.phongBan === '') delete req.body.phongBan;
        if (req.body.chucVu === '') delete req.body.chucVu;
        
        const newItem = new NhanVien(req.body);
        await newItem.save();
        req.flash('success_msg', 'Thêm nhân viên thành công!');
        res.redirect('/nhanvien');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi khi thêm: ' + err.message);
        res.redirect('/nhanvien/them');
    }
});

// Form Chỉnh sửa
router.get('/sua/:id', ensureAuthenticated, async (req, res) => {
    try {
        const nv = await NhanVien.findById(req.params.id);
        if (!nv) {
            req.flash('error_msg', 'Không tìm thấy nhân viên');
            return res.redirect('/nhanvien');
        }
        const phongbans = await PhongBan.find();
        const chucvus = await ChucVu.find();
        res.render('nhanvien_sua', { 
            title: 'Chỉnh Sửa Nhân Viên', 
            nv, 
            phongbans, 
            chucvus 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/nhanvien');
    }
});

// Xử lý Cập nhật
router.post('/sua/:id', ensureAuthenticated, async (req, res) => {
    try {
        // Xử lý giá trị trống cho các trường ObjectId
        if (req.body.phongBan === '') req.body.phongBan = null;
        if (req.body.chucVu === '') req.body.chucVu = null;

        await NhanVien.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success_msg', 'Cập nhật nhân viên thành công!');
        res.redirect('/nhanvien');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi khi cập nhật');
        res.redirect('/nhanvien');
    }
});

// Xóa
router.delete('/xoa/:id', ensureAuthenticated, async (req, res) => {
    try {
        await NhanVien.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Xóa thành công!');
        res.redirect('/nhanvien');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi khi xóa');
        res.redirect('/nhanvien');
    }
});

// Chi tiết nhân viên
router.get('/chitiet/:id', ensureAuthenticated, async (req, res) => {
    try {
        const nv = await NhanVien.findById(req.params.id).populate('phongBan chucVu');
        if (!nv) {
            req.flash('error_msg', 'Không tìm thấy nhân viên');
            return res.redirect('/nhanvien');
        }
        res.render('nhanvien_chitiet', { title: 'Hồ Sơ Nhân Viên', nv });
    } catch (err) {
        console.error(err);
        res.redirect('/nhanvien');
    }
});

module.exports = router;
