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
        Schema::create('reseller_greeting_card_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reseller_id');
            $table->unsignedBigInteger('greeting_card_template_id');
            $table->string('preview_template')->nullable();
            $table->string('preview_bg_style')->nullable();
            $table->json('preview_images')->nullable();
            $table->string('thumbnail', 500)->nullable();
            $table->unique(['reseller_id', 'greeting_card_template_id'], 'rgcs_reseller_tpl_unique');
            $table->timestamps();

            $table->foreign('reseller_id', 'rgcs_reseller_fk')
                ->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('greeting_card_template_id', 'rgcs_tpl_fk')
                ->references('id')->on('greeting_card_templates')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reseller_greeting_card_settings');
    }
};
