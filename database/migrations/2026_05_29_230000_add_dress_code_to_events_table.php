<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('show_dress_code')->default(false)->after('is_primary');
            $table->text('dress_code_text')->nullable()->after('show_dress_code');
            $table->text('dress_code_colors')->nullable()->after('dress_code_text');
        });
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['show_dress_code', 'dress_code_text', 'dress_code_colors']);
        });
    }
};
