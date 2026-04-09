const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TaiKhoanSchema = new mongoose.Schema({
    tenDangNhap: { type: String, required: true, unique: true },
    matKhau: { type: String, required: true },
    hoTen: { type: String, required: true },
    email: { type: String },
    vaiTro: { type: String, enum: ['admin', 'user'], default: 'user' },
    nhanVien: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien' },
    trangThai: { type: Boolean, default: true }
}, { timestamps: true });

TaiKhoanSchema.pre('save', async function () {
    if (!this.isModified('matKhau')) return;
    const salt = await bcrypt.genSalt(10);
    this.matKhau = await bcrypt.hash(this.matKhau, salt);
});

TaiKhoanSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.matKhau);
};

module.exports = mongoose.model('TaiKhoan', TaiKhoanSchema);
