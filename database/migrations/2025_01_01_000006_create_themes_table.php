<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->string('thumbnail', 500);
            $table->string('preview_url', 500)->nullable();
            $table->string('category', 50)->nullable()->comment('floral, elegant, rustic, modern, islamic');
            $table->json('color_scheme')->nullable()->comment('{"primary":"#xxx","secondary":"#xxx","accent":"#xxx","bg":"#xxx","text":"#xxx"}');
            $table->json('font_config')->nullable()->comment('{"heading":"font","body":"font","script":"font"}');
            $table->string('css_file', 500)->nullable();
            $table->boolean('supports_scroll')->default(true);
            $table->boolean('supports_slide')->default(true);
            $table->boolean('supports_tab')->default(true);
            $table->boolean('is_premium')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
