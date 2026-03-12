<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->json('streamings')->nullable()->after('streaming_url');
        });

        // Migrate existing single streaming data into JSON array
        $events = DB::table('events')
            ->whereNotNull('streaming_platform')
            ->where('streaming_platform', '!=', '')
            ->get();

        foreach ($events as $event) {
            DB::table('events')->where('id', $event->id)->update([
                'streamings' => json_encode([[
                    'platform' => $event->streaming_platform,
                    'url' => $event->streaming_url,
                ]]),
            ]);
        }
    }

    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('streamings');
        });
    }
};
