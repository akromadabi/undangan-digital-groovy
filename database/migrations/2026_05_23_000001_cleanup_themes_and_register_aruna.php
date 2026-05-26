<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Ensure 'utary' exists
        $utary = DB::table('themes')->where('slug', 'utary')->first();
        $utaryId = $utary ? $utary->id : null;

        // If utary doesn't exist, get the first available theme or create a dummy
        if (!$utaryId) {
            $firstTheme = DB::table('themes')->first();
            $utaryId = $firstTheme ? $firstTheme->id : null;
        }

        // 2. Redirect all invitations using deleted themes to 'utary' (or first theme)
        $keepSlugs = ['utary', 'netflix', 'luxury-01', 'luxury-02', 'luxury-03'];
        
        if ($utaryId) {
            $deletedThemeIds = DB::table('themes')
                ->whereNotIn('slug', $keepSlugs)
                ->pluck('id');

            if ($deletedThemeIds->isNotEmpty()) {
                DB::table('invitations')
                    ->whereIn('theme_id', $deletedThemeIds)
                    ->update(['theme_id' => $utaryId]);
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
