#!/bin/bash
# Matikan eksekusi jika ada eror
set -e

echo "========================================="
echo "   MEMULAI DEPLOYMENT DARI GITHUB        "
echo "========================================="

# Masuk ke folder project
cd /www/wwwroot/undangan-digital

# Daftarkan direktori sebagai safe directory git
git config --global --add safe.directory /www/wwwroot/undangan-digital || true

echo "1. Menarik pembaruan kode terbaru dari GitHub..."
git pull origin main

echo "2. Memperbarui dependensi PHP (Composer)..."
# Jalankan composer install tanpa paket development
composer install --no-dev --optimize-autoloader

echo "3. Melakukan migrasi database (jika ada struktur baru)..."
php artisan migrate --force

echo "4. Membangun aset frontend (Vite)..."
npm install
npm run build

echo "5. Membersihkan cache aplikasi..."
php artisan cache:clear
php artisan route:clear
php artisan config:clear
php artisan view:clear

echo "6. Mengatur ulang perizinan folder (Permissions)..."
# Lepas atribut immutable pada .user.ini sementara jika ada
if [ -f "public/.user.ini" ]; then
    chattr -i public/.user.ini || true
fi

# Ubah owner ke user web server (www)
chown -R www:www /www/wwwroot/undangan-digital

# Set chmod folder storage & cache agar writable
chmod -R 775 /www/wwwroot/undangan-digital/storage
chmod -R 775 /www/wwwroot/undangan-digital/bootstrap/cache

# Kunci kembali file .user.ini demi keamanan
if [ -f "public/.user.ini" ]; then
    chattr +i public/.user.ini || true
fi

echo "========================================="
echo "   ✓ DEPLOYMENT SELESAI DENGAN SUKSES!   "
echo "========================================="
