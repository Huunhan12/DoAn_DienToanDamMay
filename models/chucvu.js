const mongoose = require('mongoose');

// Hàm hỗ trợ viết hoa chữ cái đầu cho mỗi từ
const toTitleCase = (str) => {
    if (!str) return str;
    return str.toLowerCase().split(/\s+/).filter(w => w.length > 0).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Định nghĩa Schema cho Bảng Chức Vụ
const ChucVuSchema = new mongoose.Schema({
    maChucVu: { 
        type: String, 
        required: true, 
        unique: true, 
        set: v => v.toUpperCase() // Luôn lưu mã ở dạng chữ hoa
    },
    tenChucVu: { 
        type: String, 
        required: true, 
        set: v => toTitleCase(v) // Tự động định dạng tên (VD: Quản Lý)
    },
    moTa: { type: String }, // Mô tả công việc
    heSoLuong: { type: Number, default: 1.0 } // Hệ số lương để tính lương
}, { timestamps: true }); // Tự động thêm ngày tạo và ngày cập nhật

module.exports = mongoose.model('ChucVu', ChucVuSchema);
