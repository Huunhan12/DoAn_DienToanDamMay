require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Kết nối tới MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối tới MongoDB Atlas'))
  .catch(err => console.error('Không thể kết nối tới MongoDB:', err));

// Cấu hình View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Cấu hình Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 ngày
}));
app.use(flash());

// Biến toàn cục cho giao diện (Views)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});

// Khai báo các Routes
const indexRoutes = require('./routers/index');
const authRoutes = require('./routers/auth');
const nhanvienRoutes = require('./routers/nhanvien');
const phongbanRoutes = require('./routers/phongban');
const chucvuRoutes = require('./routers/chucvu');
const taikhoanRoutes = require('./routers/taikhoan');
const chamcongRoutes = require('./routers/chamcong');
const salaryRoutes = require('./routers/salary');

// Sử dụng các Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/nhanvien', nhanvienRoutes);
app.use('/phongban', phongbanRoutes);
app.use('/chucvu', chucvuRoutes);
app.use('/taikhoan', taikhoanRoutes);
app.use('/chamcong', chamcongRoutes);
app.use('/salary', salaryRoutes);
// app.use('/phongban', phongbanRoutes);
// app.use('/chucvu', chucvuRoutes);
// app.use('/taikhoan', taikhoanRoutes);

// Xử lý lỗi (Trường hợp không tìm thấy trang - 404)
app.use((req, res) => {
    res.status(404).render('error', { errorMsg: 'Không tìm thấy trang này!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Cổng đang chạy http://localhost:${PORT}`);
});
