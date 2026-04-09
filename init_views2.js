const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'views');

const entities = ['nhanvien', 'phongban', 'chucvu', 'taikhoan', 'chamcong'];

entities.forEach(entity => {
    const listContent = `<%- include('partials/header.ejs') %>
<div class="d-flex justify-content-between align-items-center mb-4">
    <h3 class="fw-bold"><i class="fas fa-list me-2"></i>Danh sách <%= title %></h3>
    <a href="#" class="btn btn-primary"><i class="fas fa-plus me-2"></i>Thêm Mới</a>
</div>
<div class="card bg-dark border-0 shadow">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-dark table-hover mb-0 align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Thông tin</th>
                        <th class="text-end">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    <% if(typeof data !== 'undefined' && data.length > 0) { %>
                        <% data.forEach(item => { %>
                            <tr>
                                <td><%= item._id %></td>
                                <td>Dữ liệu Object</td>
                                <td class="text-end">
                                    <a href="#" class="btn btn-sm btn-outline-warning"><i class="fas fa-edit"></i></a>
                                    <form action="/<%= typeof currentRoute !== 'undefined' ? currentRoute : '' %>/xoa/<%= item._id %>?_method=DELETE" method="POST" class="d-inline" onsubmit="return confirm('Bạn có chắc muốn xóa không?');">
                                        <button type="submit" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                                    </form>
                                </td>
                            </tr>
                        <% }) %>
                    <% } else { %>
                        <tr>
                            <td colspan="3" class="text-center py-4 text-muted">Chưa có dữ liệu</td>
                        </tr>
                    <% } %>
                </tbody>
            </table>
        </div>
    </div>
</div>
<%- include('partials/footer.ejs') %>`;
    
    fs.writeFileSync(path.join(viewsDir, `${entity}.ejs`), listContent);
    console.log(`Created ${entity}.ejs`);
});
