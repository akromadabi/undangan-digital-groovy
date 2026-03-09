<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bride_grooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $table->tinyInteger('order_number')->comment('1=mempelai 1, 2=mempelai 2');
            $table->string('full_name', 150);
            $table->string('nickname', 50)->nullable();
            $table->string('father_name', 150)->nullable();
            $table->string('mother_name', 150)->nullable();
            $table->enum('gender', ['pria', 'wanita']);
            $table->string('photo', 500)->nullable();
            $table->text('bio')->nullable();
            $table->string('instagram', 100)->nullable();
            $table->string('tiktok', 100)->nullable();
            $table->string('twitter', 100)->nullable();
            $table->string('facebook', 100)->nullable();
            $table->string('child_order', 50)->nullable()->comment('Putra/Putri ke-berapa');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bride_grooms');
    }
};
