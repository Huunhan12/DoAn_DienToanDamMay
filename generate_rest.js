const fs = require('fs');
const path = require('path');

const dummyDir = path.join(__dirname, 'dummy_data');

// Helper to format ObjectId for Compass
const oid = (id) => ({ "$oid": id });
const date = (d) => ({ "$date": d });

// 4. Cham Cong (March 2026 - 31 days)
const chamCongs = [];
for (let i = 1; i <= 15; i++) {
    const nvId = `6630000000000000000000${i.toString().padStart(2, '0')}`;
    for (let day = 1; day <= 31; day++) {
        let status = "Có mặt";
        const rand = Math.random();
        if (rand > 0.95) status = "Vắng mặt";
        else if (rand > 0.85) status = "Đi trễ";
        else if (rand > 0.80) status = "Nghỉ phép";

        const dayStr = day.toString().padStart(2, '0');
        chamCongs.push({
            nhanVien: oid(nvId),
            ngayChamCong: date(`2026-03-${dayStr}T08:00:00Z`),
            trangThai: status,
            ghiChu: ""
        });
    }
}
fs.writeFileSync(path.join(dummyDir, 'chamcong.json'), JSON.stringify(chamCongs, null, 2));

// 5. Bang Luong (March 2026)
const bangLuongs = [];
const salaries = [20000000, 15000000, 12000000, 13000000, 8000000, 12500000, 14000000, 11500000, 13500000, 7500000, 16000000, 11000000, 13000000, 10500000, 12000000];

for (let i = 1; i <= 15; i++) {
    const nvId = `6630000000000000000000${i.toString().padStart(2, '0')}`;
    bangLuongs.push({
        nhanVien: oid(nvId),
        thangNam: "2026-03",
        luongCoBan: salaries[i-1],
        tienXang: 500000,
        tienCom: 660000,
        tienCongTac: 200000,
        phuCap: 1360000
    });
}
fs.writeFileSync(path.join(dummyDir, 'bangluong.json'), JSON.stringify(bangLuongs, null, 2));

console.log("Đã tạo xong chamcong.json và bangluong.json");
