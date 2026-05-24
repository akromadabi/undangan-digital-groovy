#!/bin/bash
# Script Deployment untuk Undangan Digital

echo "=========================================="
echo "🚀 MEMULAI DEPLOYMENT UNDANGAN DIGITAL"
echo "=========================================="

# Pindah ke direktori aplikasi
cd /www/wwwroot/undangan-digital

# Daftarkan direktori sebagai safe directory git
git config --global --add safe.directory /www/wwwroot/undangan-digital || true

echo "⬇️ 1. Menarik pembaruan terbaru dari GitHub..."
git stash
git pull origin main

echo "📦 2. Menginstall dependensi PHP (Composer)..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "📦 3. Menginstall dependensi Node.js (NPM)..."
npm install

echo "🛠️ 4. Membangun aset frontend (Vite)..."
npm run build

echo "🗄️ 5. Menjalankan migrasi database..."
php artisan migrate --force

echo "🧹 6. Membersihkan dan menyusun cache aplikasi..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔒 7. Mengatur perizinan folder (Permissions)..."
if [ -f "public/.user.ini" ]; then
    chattr -i public/.user.ini || true
fi
chown -R www:www /www/wwwroot/undangan-digital
chmod -R 775 /www/wwwroot/undangan-digital/storage
chmod -R 775 /www/wwwroot/undangan-digital/bootstrap/cache
if [ -f "public/.user.ini" ]; then
    chattr +i public/.user.ini || true
fi

echo "=========================================="
echo "✅ DEPLOYMENT SELESAI DENGAN SUKSES!"
echo "=========================================="
