<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('greeting_card_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name');                          // "Still With You"
            $table->string('slug')->unique();               // "stillwithyou"
            $table->string('thumbnail')->nullable();         // path gambar preview
            $table->json('preview_images')->nullable();      // array gambar preview
            $table->json('type');                           // ["anniversary","birthday"]
            $table->text('description')->nullable();
            $table->json('features')->nullable();           // ["Fireworks","Interactive","Audio"]
            $table->string('bg_gradient')->nullable();       // CSS gradient class untuk placeholder
            $table->string('icon')->nullable();             // emoji/icon untuk placeholder
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('greeting_card_templates');
    }
};
