<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ai_promo_queues', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // template, feature, reseller, general
            $table->string('reference_key')->nullable(); // e.g. netflix, countdown
            $table->text('caption');
            $table->string('image_path')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->string('status')->default('pending'); // pending, posting, posted, failed
            $table->timestamp('posted_at')->nullable();
            $table->json('platforms')->nullable(); // array of target platforms, e.g. ["fb", "ig", "tiktok"]
            $table->json('post_links')->nullable(); // actual post URLs, e.g. {"ig": "...", "fb": "..."}
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_promo_queues');
    }
};
