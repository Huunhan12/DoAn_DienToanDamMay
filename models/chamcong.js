const mongoose = require('mongoose');

// Định nghĩa Schema cho Bảng Chấm Công
const ChamCongSchema = new mongoose.Schema({
    nhanVien: { type: mongoose.Schema.Types.ObjectId, ref: 'NhanVien', required: true }, // Liên kết tới nhân viên
    ngayChamCong: { type: Date, required: true }, // Ngày thực hiện chấm công
    trangThai: { type: String, enum: ['Có mặt', 'Vắng mặt', 'Đi trễ', 'Nghỉ phép'], default: 'Có mặt' }, // Trạng thái đi làm
    ghiChu: { type: String } // Ghi chú thêm (nếu có)
}, { timestamps: true }); // Tự động ghi lại thời gian tạo và cập nhật

module.exports = mongoose.model('ChamCong', ChamCongSchema);
