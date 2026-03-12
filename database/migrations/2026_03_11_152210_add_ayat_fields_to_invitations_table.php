<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->text('opening_ayat_translation')->nullable()->after('opening_ayat');
            $table->string('opening_ayat_source', 200)->nullable()->after('opening_ayat_translation');
        });
    }

    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['opening_ayat_translation', 'opening_ayat_source']);
        });
    }
};
