- Bước 1: Chạy lênh “ npm i “ để tải node_modules.
	- Bước 2: Vào file .env để thêm tài khoảng Mongodb của bạn 
mongodb://username:password@link /quanlynhansu?authSource=admin&ssl=true&retryWrites=true&w=majority
	- Bước 3: Chạy lênh “node seed_admin.js” để tại tài khoản admin
		+ Tài khoản: admin
    + Mật khẩu: admin123
	- Bước 4: Chạy lệnh “node index.js” để khởi động chương trình.
		+ Cổng chạy: http://localhost:3000 (hoặc biến PORT trong .env)
