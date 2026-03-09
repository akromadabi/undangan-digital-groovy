<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('theme_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('theme_id')->constrained()->cascadeOnDelete();
            $table->string('section_key', 50)->comment('cover, opening, bride_groom, event, gallery, love_story, bank, rsvp, wishes, closing, save_the_date, turut_mengundang, music');
            $table->string('section_name', 100);
            $table->string('component_name', 100)->comment('nama React component');
            $table->integer('default_order')->default(0);
            $table->boolean('is_removable')->default(true);
            $table->boolean('is_default')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('theme_sections');
    }
};
