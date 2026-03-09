<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invitation_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $table->string('section_key', 50);
            $table->string('section_name', 100);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->json('custom_config')->nullable()->comment('override konfigurasi section');
            $table->timestamps();

            $table->unique(['invitation_id', 'section_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invitation_sections');
    }
};
