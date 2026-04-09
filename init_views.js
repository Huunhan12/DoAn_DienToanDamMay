const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');
const partialsDir = path.join(viewsDir, 'partials');

if (!fs.existsSync(partialsDir)) fs.mkdirSync(partialsDir, { recursive: true });

const views = {
    'partials/header.ejs': `<!DOCTYPE html>
<html lang="en" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= typeof title !== 'undefined' ? title : 'Quản Lý Nhân Sự' %></title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="/css/app.css">
</head>
<body>
    <%- include('navbar.ejs') %>
    <div class="container mt-4">
        <% if(success_msg != '') { %>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <%= success_msg %>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <% } %>
        <% if(error_msg != '') { %>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <%= error_msg %>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <% } %>
        <% if(error != '') { %>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <%= error %>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <% } %>
`,
    'partials/footer.ejs': `    </div> <!-- End Container -->
    
    <!-- Bootstrap 5 JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- jQuery (Optional for plugins) -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="/js/app.js"></script>
</body>
</html>`,
    'partials/navbar.ejs': `<nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
    <div class="container">
        <a class="navbar-brand text-primary fw-bold" href="/"><i class="fas fa-users me-2"></i>HR Admin</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto">
                <% if(user) { %>
                    <li class="nav-item">
                        <a class="nav-link" href="/"><i class="fas fa-tachometer-alt me-1"></i>Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/nhanvien"><i class="fas fa-user-tie me-1"></i>Nhân viên</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/phongban"><i class="fas fa-building me-1"></i>Phòng ban</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/chucvu"><i class="fas fa-briefcase me-1"></i>Chức vụ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/chamcong"><i class="fas fa-calendar-check me-1"></i>Chấm công</a>
                    </li>
                    <% if(user.vaiTro === 'admin') { %>
                    <li class="nav-item">
                        <a class="nav-link text-warning" href="/taikhoan"><i class="fas fa-users-cog me-1"></i>Tài khoản</a>
                    </li>
                    <% } %>
                <% } %>
            </ul>
            <ul class="navbar-nav ms-auto">
                <% if(user) { %>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-user-circle me-1"></i> <%= user.hoTen %>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="#"><i class="fas fa-cog me-2"></i>Cài đặt</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="/auth/dangxuat"><i class="fas fa-sign-out-alt me-2"></i>Đăng xuất</a></li>
                        </ul>
                    </li>
                <% } else { %>
                    <li class="nav-item">
                        <a class="nav-link" href="/auth/dangnhap"><i class="fas fa-sign-in-alt me-1"></i>Đăng nhập</a>
                    </li>
                <% } %>
            </ul>
        </div>
    </div>
</nav>`,
    'dangnhap.ejs': `<%- include('partials/header.ejs') %>
<div class="row justify-content-center mt-5">
    <div class="col-md-5">
        <div class="card shadow-lg border-0 bg-dark-subtle">
            <div class="card-body p-5">
                <div class="text-center mb-4">
                    <h2 class="fw-bold text-primary"><i class="fas fa-user-lock me-2"></i>Đăng Nhập</h2>
                    <p class="text-muted">Hệ thống quản lý nhân sự</p>
                </div>
                <form action="/auth/dangnhap" method="POST">
                    <div class="mb-3">
                        <label class="form-label">Tên đăng nhập</label>
                        <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary"><i class="fas fa-user text-muted"></i></span>
                            <input type="text" class="form-control" name="tenDangNhap" required placeholder="Nhập tên đăng nhập...">
                        </div>
                    </div>
                    <div class="mb-4">
                        <label class="form-label">Mật khẩu</label>
                        <div class="input-group">
                            <span class="input-group-text bg-dark border-secondary"><i class="fas fa-lock text-muted"></i></span>
                            <input type="password" class="form-control" name="matKhau" required placeholder="Nhập mật khẩu...">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2 fs-5"><i class="fas fa-sign-in-alt me-2"></i>Đăng Nhập</button>
                </form>
            </div>
        </div>
    </div>
</div>
<%- include('partials/footer.ejs') %>`,
    'index.ejs': `<%- include('partials/header.ejs') %>
<div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="h3 fw-bold text-white">Tổng Quan Màn Hình Chính</h1>
    <div>
        <span class="text-muted"><%= new Date().toLocaleDateString('vi-VN') %></span>
    </div>
</div>

<div class="row g-4 mb-4">
    <div class="col-md-4">
        <div class="card bg-primary text-white border-0 shadow h-100">
            <div class="card-body d-flex align-items-center">
                <div class="fs-1 me-4"><i class="fas fa-users"></i></div>
                <div>
                    <h5 class="card-title mb-1">Tổng Nhân Viên</h5>
                    <h2 class="fw-bold mb-0"><%= typeof countNhanVien !== 'undefined' ? countNhanVien : 0 %></h2>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card bg-success text-white border-0 shadow h-100">
            <div class="card-body d-flex align-items-center">
                <div class="fs-1 me-4"><i class="fas fa-building"></i></div>
                <div>
                    <h5 class="card-title mb-1">Tổng Phòng Ban</h5>
                    <h2 class="fw-bold mb-0"><%= typeof countPhongBan !== 'undefined' ? countPhongBan : 0 %></h2>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-4">
        <div class="card bg-warning text-dark border-0 shadow h-100">
            <div class="card-body d-flex align-items-center">
                <div class="fs-1 me-4"><i class="fas fa-briefcase"></i></div>
                <div>
                    <h5 class="card-title mb-1">Tổng Chức Vụ</h5>
                    <h2 class="fw-bold mb-0"><%= typeof countChucVu !== 'undefined' ? countChucVu : 0 %></h2>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="card border-0 shadow-sm bg-dark">
    <div class="card-header bg-transparent border-secondary py-3 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold"><i class="fas fa-user-plus me-2 text-info"></i>Nhân Viên Mới Thêm</h5>
        <a href="/nhanvien" class="btn btn-sm btn-outline-info">Xem tất cả</a>
    </div>
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover table-dark mb-0 align-middle">
                <thead>
                    <tr>
                        <th>Mã NV</th>
                        <th>Họ Tên</th>
                        <th>Phòng Ban</th>
                        <th>Chức Vụ</th>
                        <th>Ngày Vào Làm</th>
                    </tr>
                </thead>
                <tbody>
                    <% if(typeof nhanVienMoi !== 'undefined' && nhanVienMoi.length > 0) { %>
                        <% nhanVienMoi.forEach(nv => { %>
                            <tr>
                                <td><%= nv.maNV %></td>
                                <td>
                                    <div class="d-flex align-items-center">
                                        <div class="avatar-sm bg-secondary rounded-circle me-2 d-flex justify-content-center align-items-center" style="width:32px;height:32px">
                                            <i class="fas fa-user text-light"></i>
                                        </div>
                                        <span class="fw-medium"><%= nv.hoTen %></span>
                                    </div>
                                </td>
                                <td><%= nv.phongBan ? nv.phongBan.tenPhongBan : 'Chưa xếp' %></td>
                                <td><span class="badge bg-secondary"><%= nv.chucVu ? nv.chucVu.tenChucVu : 'Chưa xếp' %></span></td>
                                <td><%= new Date(nv.ngayVaoLam).toLocaleDateString('vi-VN') %></td>
                            </tr>
                        <% }) %>
                    <% } else { %>
                        <tr>
                            <td colspan="5" class="text-center py-4 text-muted">Chưa có nhân viên nào!</td>
                        </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>
</div>
<%- include('partials/footer.ejs') %>`,
    'error.ejs': `<%- include('partials/header.ejs') %>
<div class="text-center mt-5">
    <h1 class="display-1 text-danger fw-bold">404/Lỗi</h1>
    <h3 class="mb-4"><%= typeof errorMsg !== 'undefined' ? errorMsg : 'Đã có lỗi xảy ra!' %></h3>
    <a href="/" class="btn btn-primary"><i class="fas fa-home me-2"></i>Về Trang Chủ</a>
</div>
<%- include('partials/footer.ejs') %>`
};

// Create files
Object.keys(views).forEach(file => {
    fs.writeFileSync(path.join(viewsDir, file), views[file]);
    console.log(`Created view ${file}`);
});
