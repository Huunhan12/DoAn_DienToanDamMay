const mongoose = require('mongoose');

// Hàm hỗ trợ viết hoa chữ cái đầu cho mỗi từ
const toTitleCase = (str) => {
    if (!str) return str;
    return str.toLowerCase().split(/\s+/).filter(w => w.length > 0).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Định nghĩa Schema cho Bảng Phòng Ban
const PhongBanSchema = new mongoose.Schema({
    maPhongBan: { 
        type: String, 
        required: true, 
        unique: true, 
        set: v => v.toUpperCase() // Mã phòng ban luôn lưu chữ hoa (VD: PB01)
    },
    tenPhongBan: { 
        type: String, 
        required: true, 
        set: v => toTitleCase(v) // Tự động định dạng tên phòng ban
    },
    moTa: { type: String }, // Mô tả chức năng nhiệm vụ
    ngayThanhLap: { type: Date } // Ngày thành lập phòng ban
}, { timestamps: true }); // Tự động quản lý createdAt và updatedAt

module.exports = mongoose.model('PhongBan', PhongBanSchema);
