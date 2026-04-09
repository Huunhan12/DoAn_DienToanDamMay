const express = require('express');
const router = express.Router();
const PhongBan = require('../models/phongban');

const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/auth/dangnhap');
};

// Danh sách phòng ban
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const list = await PhongBan.find();
        res.render('phongban', { title: 'Quản Lý Phòng Ban', data: list });
    } catch (err) {
        res.render('error', { errorMsg: 'Lỗi tải danh sách' });
    }
});

// Giao diện Thêm phòng ban
router.get('/them', ensureAuthenticated, (req, res) => {
    res.render('phongban_form', { title: 'Thêm Phòng Ban', pb: null });
});

// Xử lý Thêm phòng ban
router.post('/them', ensureAuthenticated, async (req, res) => {
    try {
        const newPb = new PhongBan(req.body);
        await newPb.save();
        req.flash('success_msg', 'Thêm phòng ban thành công');
        res.redirect('/phongban');
    } catch (err) {
        req.flash('error_msg', 'Lỗi khi thêm');
        res.redirect('/phongban/them');
    }
});

// Giao diện Sửa phòng ban
router.get('/sua/:id', ensureAuthenticated, async (req, res) => {
    try {
        const pb = await PhongBan.findById(req.params.id);
        res.render('phongban_form', { title: 'Sửa Phòng Ban', pb });
    } catch (err) {
        res.redirect('/phongban');
    }
});

// Xử lý Sửa phòng ban
router.post('/sua/:id', ensureAuthenticated, async (req, res) => {
    try {
        await PhongBan.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success_msg', 'Cập nhật thành công');
        res.redirect('/phongban');
    } catch (err) {
        res.redirect('/phongban');
    }
});

// Xóa phòng ban
router.delete('/xoa/:id', ensureAuthenticated, async (req, res) => {
    try {
        await PhongBan.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Xóa thành công');
        res.redirect('/phongban');
    } catch (err) {
        res.redirect('/phongban');
    }
});

module.exports = router;
