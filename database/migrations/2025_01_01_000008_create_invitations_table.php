<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('theme_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug', 100)->unique()->comment('URL: domain.com/u/{slug}');
            $table->string('title', 200)->nullable();

            // Opening Section
            $table->string('opening_title', 200)->nullable();
            $table->text('opening_text')->nullable();
            $table->text('opening_ayat')->nullable()->comment('ayat/kutipan pembuka');

            // Penutup Section
            $table->string('closing_title', 200)->nullable();
            $table->text('closing_text')->nullable();

            // Cover
            $table->string('cover_image', 500)->nullable();
            $table->string('cover_title', 200)->nullable();
            $table->string('cover_subtitle', 200)->nullable();

            // Layout Settings
            $table->enum('layout_mode', ['scroll', 'slide', 'tab'])->default('scroll');

            // Music
            $table->string('music_url', 500)->nullable();
            $table->boolean('music_autoplay')->default(true);

            // Save The Date
            $table->boolean('save_the_date_enabled')->default(false);
            $table->dateTime('countdown_target_date')->nullable();

            // Turut Mengundang
            $table->text('turut_mengundang_text')->nullable();

            // Status
            $table->boolean('is_published')->default(false);
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
