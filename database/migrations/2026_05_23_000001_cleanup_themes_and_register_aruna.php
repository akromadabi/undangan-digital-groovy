<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Ensure 'adat-jawa' exists
        $adatJawa = DB::table('themes')->where('slug', 'adat-jawa')->first();
        $adatJawaId = $adatJawa ? $adatJawa->id : null;

        // If adat-jawa doesn't exist, get the first available theme or create a dummy
        if (!$adatJawaId) {
            $firstTheme = DB::table('themes')->first();
            $adatJawaId = $firstTheme ? $firstTheme->id : null;
        }

        // 2. Redirect all invitations using deleted themes to 'adat-jawa' (or first theme)
        $keepSlugs = ['adat-jawa', 'utary', 'netflix', 'luxury-01', 'luxury-02', 'luxury-03', 'aruna'];
        
        if ($adatJawaId) {
            $deletedThemeIds = DB::table('themes')
                ->whereNotIn('slug', $keepSlugs)
                ->pluck('id');

            if ($deletedThemeIds->isNotEmpty()) {
                DB::table('invitations')
                    ->whereIn('theme_id', $deletedThemeIds)
                    ->update(['theme_id' => $adatJawaId]);
            }
        }

        // 3. Delete unused themes (this cascades to theme_sections)
        DB::table('themes')
            ->whereNotIn('slug', $keepSlugs)
            ->delete();
    }

    public function down(): void
    {
        //
    }
};
