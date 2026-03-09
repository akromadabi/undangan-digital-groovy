<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $table->string('name', 150);
            $table->string('slug', 150)->comment('untuk URL unik: domain.com/u/slug?to=guest-slug');
            $table->string('phone', 20)->nullable();
            $table->string('email', 150)->nullable();
            $table->string('group_name', 100)->nullable()->comment('kelompok: keluarga, teman, kantor');
            $table->tinyInteger('max_pax')->default(2)->comment('jumlah orang yang diundang');
            $table->boolean('wa_sent')->default(false);
            $table->timestamp('wa_sent_at')->nullable();
            $table->boolean('is_opened')->default(false);
            $table->timestamp('opened_at')->nullable();
            $table->timestamps();

            $table->unique(['invitation_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
