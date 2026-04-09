const fs = require('fs');
const path = require('path');

const dirs = [
    'models',
    'routers',
    'views',
    'modules',
    'public/css',
    'public/js',
    'public/images'
];

dirs.forEach(dir => {
    fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

console.log('Directories created!');
