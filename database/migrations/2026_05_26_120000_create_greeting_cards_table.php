<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('greeting_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title')->default('Kartu Ucapan');
            $table->string('template')->default('stillwithyou'); // stillwithyou | giftforanita
            $table->string('type')->default('anniversary'); // anniversary | birthday | graduation | wedding
            $table->string('recipient_name');
            $table->string('sender_name');
            $table->string('photo_url')->nullable();
            $table->json('messages')->nullable(); // array of strings
            $table->string('custom_url')->unique()->nullable(); // public share slug
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('greeting_cards');
    }
};
