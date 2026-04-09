const fs = require('fs');
const path = require('path');

const routers = [
    { name: 'nhanvien', model: 'NhanVien' },
    { name: 'phongban', model: 'PhongBan' },
    { name: 'chucvu', model: 'ChucVu' },
    { name: 'taikhoan', model: 'TaiKhoan' },
    { name: 'chamcong', model: 'ChamCong' }
];

routers.forEach(router => {
    const content = `const express = require('express');
const router = express.Router();
const ${router.model} = require('../models/${router.name}');

// Middleware to check if user is logged in
const ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/auth/dangnhap');
};

// Lấy danh sách
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const list = await ${router.model}.find();
        res.render('${router.name}', { title: 'Quản Lý ${router.model}', data: list });
    } catch (err) {
        console.error(err);
        res.render('error', { errorMsg: 'Lỗi tải dữ liệu' });
    }
});

// Thêm mới
router.post('/them', ensureAuthenticated, async (req, res) => {
    try {
        const newItem = new ${router.model}(req.body);
        await newItem.save();
        req.flash('success_msg', 'Thêm mới thành công!');
        res.redirect('/${router.name}');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi thêm mới');
        res.redirect('/${router.name}');
    }
});

// Xóa
router.post('/xoa/:id', ensureAuthenticated, async (req, res) => {
    try {
        await ${router.model}.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Xóa thành công!');
        res.redirect('/${router.name}');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Lỗi khi xóa');
        res.redirect('/${router.name}');
    }
});

module.exports = router;
`;
    fs.writeFileSync(path.join(__dirname, 'routers', `${router.name}.js`), content);
    console.log(`Created router ${router.name}.js`);
});
