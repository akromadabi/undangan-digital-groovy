<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $unwantedSlugs = [
            'adat-jawa',
            'aruna',
            'dusk-mosque',
            'jawa-klasik',
            'jawa-2',
            'jawa-new',
            'manchester-united'
        ];

        // Ensure 'utary' theme exists to redirect to
        $utary = DB::table('themes')->where('slug', 'utary')->first();
        if ($utary) {
            $fallbackThemeId = $utary->id;
        } else {
            // Fallback to the first theme in DB
            $firstTheme = DB::table('themes')->first();
            $fallbackThemeId = $firstTheme ? $firstTheme->id : null;
        }

        if ($fallbackThemeId) {
            $unwantedThemeIds = DB::table('themes')
                ->whereIn('slug', $unwantedSlugs)
                ->pluck('id');

            if ($unwantedThemeIds->isNotEmpty()) {
                // Redirect existing invitations to the fallback theme
                DB::table('invitations')
                    ->whereIn('theme_id', $unwantedThemeIds)
                    ->update(['theme_id' => $fallbackThemeId]);
            }
        }

        // Delete the unwanted themes
        DB::table('themes')
            ->whereIn('slug', $unwantedSlugs)
            ->delete();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No rollback
    }
};
