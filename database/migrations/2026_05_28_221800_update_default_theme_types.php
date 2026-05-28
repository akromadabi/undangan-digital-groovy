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
        // Set concept and mockup themes to 'general' so they are available for all event categories
        $generalThemes = [
            'netflix',
            'spotify',
            'instagram',
            'tiktok',
            'wayang',
            'shopee',
            'manchester-united'
        ];

        DB::table('themes')
            ->whereIn('slug', $generalThemes)
            ->update(['type' => 'general']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $generalThemes = [
            'netflix',
            'spotify',
            'instagram',
            'tiktok',
            'wayang',
            'shopee',
            'manchester-united'
        ];

        DB::table('themes')
            ->whereIn('slug', $generalThemes)
            ->update(['type' => 'wedding']);
    }
};
