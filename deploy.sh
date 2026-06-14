#!/bin/bash
# Script Deployment untuk Undangan Digital

echo "=========================================="
echo "🚀 MEMULAI DEPLOYMENT UNDANGAN DIGITAL"
echo "=========================================="

# Pindah ke direktori aplikasi
cd /www/wwwroot/undangan-digital

echo "🔎 DIAGNOSTIK VERSI PHP:"
echo "- CLI Default: $(which php) ($(php -v | head -n 1))"
echo "- Direktori PHP Terinstal:"
ls -d /www/server/php/* 2>/dev/null || echo "  (Tidak ditemukan direktori /www/server/php/*)"

# Deteksi PHP binary yang sesuai (Laravel 12 / Composer membutuhkan >= 8.2)
PHP_BIN="php"
if [ -f "/www/server/php/83/bin/php" ]; then
    PHP_BIN="/www/server/php/83/bin/php"
elif [ -f "/www/server/php/82/bin/php" ]; then
    PHP_BIN="/www/server/php/82/bin/php"
elif command -v php8.3 &>/dev/null; then
    PHP_BIN="php8.3"
elif command -v php8.2 &>/dev/null; then
    PHP_BIN="php8.2"
fi

echo "Menggunakan PHP: $($PHP_BIN -v | head -n 1)"

# Daftarkan direktori sebagai safe directory git
git config --global --add safe.directory /www/wwwroot/undangan-digital || true

# Buka kunci file keamanan .user.ini sebelum git stash/pull
if [ -f "public/.user.ini" ]; then
    chattr -i public/.user.ini || true
fi

echo "⬇️ 1. Menarik pembaruan terbaru dari GitHub..."
git stash
git pull origin main

# Jalankan perbaikan otomatis typo domain di .env jika ada
$PHP_BIN fix_env.php

echo "📦 2. Menginstall dependensi PHP (Composer)..."
if command -v composer &>/dev/null; then
    COMPOSER_PATH=$(command -v composer)
    $PHP_BIN $COMPOSER_PATH install --no-interaction --prefer-dist --optimize-autoloader
else
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

echo "📦 3. Menginstall dependensi Node.js (NPM)..."
npm install

echo "🛠️ 4. Membangun aset frontend (Vite)..."
export NODE_OPTIONS="--max-old-space-size=1024"
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Gagal membangun aset frontend (Vite)!"
    exit 1
fi

# Hapus node_modules setelah build selesai untuk menghemat penyimpanan VPS
echo "🧹 Menghapus node_modules setelah build selesai..."
rm -rf node_modules

echo "🗄️ 5. Menjalankan migrasi database..."
$PHP_BIN artisan migrate --force
$PHP_BIN artisan db:seed --force

echo "🧹 6. Membersihkan dan menyusun cache aplikasi..."
$PHP_BIN artisan optimize:clear
$PHP_BIN artisan config:cache
$PHP_BIN artisan route:cache
$PHP_BIN artisan view:cache

echo "🔒 7. Mengatur perizinan folder (Permissions)..."
chown -R www:www /www/wwwroot/undangan-digital
chmod -R 775 /www/wwwroot/undangan-digital/storage
chmod -R 775 /www/wwwroot/undangan-digital/bootstrap/cache

# Kunci kembali file keamanan .user.ini
if [ -f "public/.user.ini" ]; then
    chattr +i public/.user.ini || true
fi

echo "=========================================="
echo "✅ DEPLOYMENT SELESAI DENGAN SUKSES!"
echo "=========================================="
