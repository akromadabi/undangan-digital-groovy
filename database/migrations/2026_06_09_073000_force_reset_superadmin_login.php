<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cari atau pastikan user super_admin memiliki email akromadabi@gmail.com dan password akromadabi
        $superAdmin = DB::table('users')->where('role', 'super_admin')->first();

        if ($superAdmin) {
            DB::table('users')
                ->where('id', $superAdmin->id)
                ->update([
                    'email' => 'akromadabi@gmail.com',
                    'password' => Hash::make('akromadabi'),
                    'is_active' => true,
                ]);
        } else {
            // Jika tidak ditemukan, buat baru
            DB::table('users')->insert([
                'name' => 'Super Admin',
                'email' => 'akromadabi@gmail.com',
                'password' => Hash::make('akromadabi'),
                'role' => 'super_admin',
                'is_active' => true,
                'onboarding_step' => 6,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to revert
    }
};
