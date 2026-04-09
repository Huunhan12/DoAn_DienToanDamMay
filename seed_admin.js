require('dotenv').config();
const mongoose = require('mongoose');
const TaiKhoan = require('./models/taikhoan');

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Đã kết nối MongoDB để khởi tạo dữ liệu...');

        const adminExists = await TaiKhoan.findOne({ tenDangNhap: 'admin' });
        if (adminExists) {
            console.log('Tài khoản Admin đã tồn tại.');
        } else {
            const admin = new TaiKhoan({
                tenDangNhap: 'admin',
                matKhau: 'admin123', // Mật khẩu sẽ được mã hóa tự động bởi Schema hook
                hoTen: 'Administrator',
                email: 'admin@example.com',
                vaiTro: 'admin',
                trangThai: true
            });
            await admin.save();
            console.log('✅ Đã tạo tài khoản Admin thành công: admin / admin123');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
}

seedAdmin();
