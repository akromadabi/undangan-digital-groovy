<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $table->string('event_type', 50)->comment('akad, pemberkatan, resepsi, lainnya');
            $table->string('event_name', 100);
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->string('timezone', 20)->default('WIB');
            $table->string('venue_name', 200)->nullable();
            $table->text('venue_address')->nullable();
            $table->string('gmaps_link', 500)->nullable();
            $table->text('gmaps_embed')->nullable()->comment('iframe embed google maps');
            $table->tinyInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
