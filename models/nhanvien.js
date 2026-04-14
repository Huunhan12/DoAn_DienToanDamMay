const mongoose = require('mongoose');

// Hàm hỗ trợ định dạng viết hoa chữ cái đầu cho Họ tên, Địa chỉ...
const toTitleCase = (str) => {
    if (!str) return str;
    return str.toLowerCase().split(/\s+/).filter(w => w.length > 0).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
};

// Định nghĩa Schema cho Bảng Nhân Viên
const NhanVienSchema = new mongoose.Schema({
    maNV: { 
        type: String, 
        required: true, 
        unique: true, 
        set: v => v.toUpperCase() // Mã nhân viên luôn lưu chữ hoa
    },
    hoTen: { 
        type: String, 
        required: true, 
        set: v => toTitleCase(v) // Tự động định dạng họ tên
    },
    ngaySinh: { 
        type: Date, 
        required: [true, 'Ngày sinh là bắt buộc'],
        validate: {
            validator: function(v) {
                if (!v) return false;
                const today = new Date();
                const birthDate = new Date(v);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age >= 18;
            },
            message: 'Nhân viên phải từ 18 tuổi trở lên (đủ 18 năm tính đến ngày hiện tại)'
        }
    },
    gioiTinh: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Nam' },
    diaChi: { 
        type: String, 
        set: v => toTitleCase(v) 
    },
    soDienThoai: { type: String },
    email: { type: String },
    phongBan: { type: mongoose.Schema.Types.ObjectId, ref: 'PhongBan' }, // Liên kết tới phòng ban
    chucVu: { type: mongoose.Schema.Types.ObjectId, ref: 'ChucVu' }, // Liên kết tới chức vụ
    ngayVaoLam: { type: Date, default: Date.now },
    luongCoBan: { type: Number, default: 0 }, // Lương khởi điểm
    hinhAnh: { type: String, default: 'default.jpg' }, // Tên file ảnh hồ sơ
    trangThai: { type: String, enum: ['Đang làm việc', 'Đã nghỉ việc'], default: 'Đang làm việc' }
}, { timestamps: true }); // Tự động quản lý createdAt và updatedAt

module.exports = mongoose.model('NhanVien', NhanVienSchema);
