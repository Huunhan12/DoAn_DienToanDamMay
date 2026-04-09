require('dotenv').config();
const mongoose = require('mongoose');
const NhanVien = require('../models/nhanvien');
const PhongBan = require('../models/phongban');
const ChucVu = require('../models/chucvu');

async function testFormatting() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected for testing...');

        const testNV = new NhanVien({
            maNV: 'nv999',
            hoTen: 'nguyễn văn tùng',
            diaChi: '123 đường láng, hà nội'
        });
        console.log('NV Format test:');
        console.log('maNV:', testNV.maNV); // Should be NV999
        console.log('hoTen:', testNV.hoTen); // Should be Nguyễn Văn Tùng
        console.log('diaChi:', testNV.diaChi); // Should be 123 Đường Láng, Hà Nội

        const testPB = new PhongBan({
            maPhongBan: 'pb_test',
            tenPhongBan: 'phòng nhân sự'
        });
        console.log('\nPB Format test:');
        console.log('maPhongBan:', testPB.maPhongBan); // Should be PB_TEST
        console.log('tenPhongBan:', testPB.tenPhongBan); // Should be Phòng Nhân Sự

        const testCV = new ChucVu({
            maChucVu: 'cv_dev',
            tenChucVu: 'lập trình viên'
        });
        console.log('\nCV Format test:');
        console.log('maChucVu:', testCV.maChucVu); // Should be CV_DEV
        console.log('tenChucVu:', testCV.tenChucVu); // Should be Lập Trình Viên

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testFormatting();
