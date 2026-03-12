<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reseller_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('brand_name', 100)->nullable();
            $table->string('brand_logo', 500)->nullable();
            $table->string('subdomain', 50)->unique()->nullable();
            $table->string('custom_domain', 255)->unique()->nullable();
            $table->string('landing_page_template', 50)->default('default');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reseller_settings');
    }
};
