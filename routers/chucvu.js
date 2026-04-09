const express = require('express');
const router = express.Router();
const ChucVu = require('../models/chucvu');

const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/auth/dangnhap');
};

// Danh sách chức vụ
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const list = await ChucVu.find();
        res.render('chucvu', { title: 'Quản Lý Chức Vụ', data: list });
    } catch (err) {
        res.render('error', { errorMsg: 'Lỗi tải danh sách' });
    }
});

// Giao diện Thêm chức vụ
router.get('/them', ensureAuthenticated, (req, res) => {
    res.render('chucvu_form', { title: 'Thêm Chức Vụ', cv: null });
});

// Xử lý Thêm chức vụ
router.post('/them', ensureAuthenticated, async (req, res) => {
    try {
        const newItem = new ChucVu(req.body);
        await newItem.save();
        req.flash('success_msg', 'Thêm chức vụ thành công');
        res.redirect('/chucvu');
    } catch (err) {
        req.flash('error_msg', 'Lỗi khi thêm');
        res.redirect('/chucvu/them');
    }
});

// Giao diện Sửa chức vụ
router.get('/sua/:id', ensureAuthenticated, async (req, res) => {
    try {
        const cv = await ChucVu.findById(req.params.id);
        res.render('chucvu_form', { title: 'Sửa Chức Vụ', cv });
    } catch (err) {
        res.redirect('/chucvu');
    }
});

// Xử lý Sửa chức vụ
router.post('/sua/:id', ensureAuthenticated, async (req, res) => {
    try {
        await ChucVu.findByIdAndUpdate(req.params.id, req.body);
        req.flash('success_msg', 'Cập nhật thành công');
        res.redirect('/chucvu');
    } catch (err) {
        res.redirect('/chucvu');
    }
});

// Xóa chức vụ
router.delete('/xoa/:id', ensureAuthenticated, async (req, res) => {
    try {
        await ChucVu.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Xóa thành công');
        res.redirect('/chucvu');
    } catch (err) {
        res.redirect('/chucvu');
    }
});

module.exports = router;
