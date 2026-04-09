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

// Tuyến đường Dashboard (Trang chủ)
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        // Nếu là role 'user', không cần hiện stats tổng
        if (req.session.user.vaiTro === 'user') {
            return res.render('index', {
                title: 'Trang Chủ | Quản Lý Nhân Sự',
                countNhanVien: null,
                countPhongBan: null,
                countChucVu: null,
                nhanVienMoi: []
            });
        }

        const countNhanVien = await NhanVien.countDocuments();
        const countPhongBan = await PhongBan.countDocuments();
        const countChucVu = await ChucVu.countDocuments();
        const nhanVienMoi = await NhanVien.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('phongBan chucVu');

        res.render('index', {
            title: 'Dashboard | Quản Lý Nhân Sự',
            countNhanVien,
            countPhongBan,
            countChucVu,
            nhanVienMoi
        });
    } catch (err) {
        console.error(err);
        res.render('error', { errorMsg: 'Lỗi tải trang chủ' });
    }
});

module.exports = router;
