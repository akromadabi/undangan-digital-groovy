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
        // Update feature name
        DB::table('features')
            ->where('slug', 'love_story')
            ->update(['name' => 'Cerita Kami']);

        // Update default theme sections
        DB::table('theme_sections')
            ->where('section_key', 'love_story')
            ->update(['section_name' => 'Cerita Kami']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert feature name
        DB::table('features')
            ->where('slug', 'love_story')
            ->update(['name' => 'Kisah Cinta']);

        // Revert default theme sections
        DB::table('theme_sections')
            ->where('section_key', 'love_story')
            ->update(['section_name' => 'Kisah Cinta']);
    }
};
