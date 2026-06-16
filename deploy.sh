#!/bin/bash
# Script Deployment Pintar untuk Undangan Digital

echo "=========================================="
echo "🚀 MEMULAI DEPLOYMENT UNDANGAN DIGITAL"
echo "=========================================="

# Cek parameter --force
FORCE_DEPLOY=false
if [ "$1" == "--force" ]; then
    FORCE_DEPLOY=true
    echo "⚠️ Menjalankan deployment dengan mode FORCE (semua proses akan dieksekusi)."
fi

# Pindah ke direktori aplikasi
cd /www/wwwroot/undangan-digital

# 1. Deteksi dan prioritaskan versi PHP yang tepat di aaPanel (Laravel 12 / Composer membutuhkan >= 8.2)
echo "🔍 Mendeteksi versi PHP di server..."
for ver in 83 82 81; do
    if [ -d "/www/server/php/$ver/bin" ]; then
        export PATH="/www/server/php/$ver/bin:$PATH"
        echo "   -> Menggunakan PHP $ver ($(/www/server/php/$ver/bin/php -v | head -n 1))"
        break
    fi
done

# Izinkan Composer berjalan sebagai superuser/root di server
export COMPOSER_ALLOW_SUPERUSER=1

# Daftarkan direktori sebagai safe directory git
git config --global --add safe.directory /www/wwwroot/undangan-digital || true

# Ambil commit hash sebelum pull untuk membandingkan perubahan
PREV_COMMIT=$(git rev-parse HEAD 2>/dev/null)

# Buka kunci file keamanan .user.ini sebelum git stash/pull
if [ -f "public/.user.ini" ]; then
    chattr -i public/.user.ini || true
fi

echo "⬇️ 1. Menarik pembaruan terbaru dari GitHub..."
git stash
git pull origin main

NEW_COMMIT=$(git rev-parse HEAD 2>/dev/null)

# Jalankan perbaikan otomatis typo domain di .env jika ada
if [ -f "fix_env.php" ]; then
    php fix_env.php
fi

# 2. Instalasi Dependensi PHP (Composer)
if [ "$FORCE_DEPLOY" = true ] || [ "$PREV_COMMIT" = "$NEW_COMMIT" ] || git diff --name-only $PREV_COMMIT $NEW_COMMIT | grep -q "composer.lock"; then
    echo "📦 2. Menginstall dependensi PHP (Composer)..."
    composer install --no-interaction --prefer-dist --optimize-autoloader
else
    echo "⏭️ 2. Dependensi PHP tidak berubah. Melewati composer install."
fi

# 3. Memastikan Aset Frontend Terkompilasi dari Git
echo "🔄 3. Mengembalikan aset frontend terkompilasi dari Git..."
git checkout HEAD -- public/build

# 4. Menjalankan migrasi database
echo "🗄️ 4. Menjalankan migrasi database..."
php artisan migrate --force
php artisan db:seed --force

# 5. Membersihkan dan menyusun cache aplikasi
echo "🧹 5. Membersihkan dan menyusun cache aplikasi..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Mengatur perizinan folder (Permissions)
echo "🔒 6. Mengatur perizinan folder (Permissions)..."
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
