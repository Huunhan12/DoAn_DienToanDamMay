const mongoose = require('mongoose');

// Định nghĩa Schema cho Bảng Lương (lưu lịch sử lương các tháng)
const BangLuongSchema = new mongoose.Schema({
    nhanVien: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien', required: true }, // Liên kết tới nhân viên
    thangNam: { type: String, required: true }, // Định dạng: YYYY-MM
    luongCoBan: { type: Number, required: true }, // Lương cơ bản tại thời điểm chốt
    tienXang: { type: Number, default: 0 },
    tienCom: { type: Number, default: 0 },
    tienCongTac: { type: Number, default: 0 },
    phuCap: { type: Number, default: 0 } // Tổng phụ cấp tại thời điểm chốt
}, { timestamps: true });

// Hỗ trợ truy vấn nhanh theo nhân viên và tháng
BangLuongSchema.index({ nhanVien: 1, thangNam: 1 }, { unique: true });

module.exports = mongoose.model('BangLuong', BangLuongSchema);
