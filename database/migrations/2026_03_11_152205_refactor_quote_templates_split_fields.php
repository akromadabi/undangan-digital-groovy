<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('quote_templates', function (Blueprint $table) {
            $table->text('ayat')->nullable()->after('title');       // Teks utama (arab/kutipan)
            $table->text('translation')->nullable()->after('ayat'); // Terjemahan
            $table->string('source', 200)->nullable()->after('translation'); // Sumber (QS. Ar-Rum: 21)
        });

        // Migrate existing data: move content to ayat, then drop content
        $templates = \DB::table('quote_templates')->get();
        foreach ($templates as $t) {
            \DB::table('quote_templates')->where('id', $t->id)->update([
                'ayat' => $t->content,
                'source' => $t->title,
            ]);
        }

        Schema::table('quote_templates', function (Blueprint $table) {
            $table->dropColumn('content');
        });
    }

    public function down(): void
    {
        Schema::table('quote_templates', function (Blueprint $table) {
            $table->text('content')->nullable()->after('title');
        });

        $templates = \DB::table('quote_templates')->get();
        foreach ($templates as $t) {
            \DB::table('quote_templates')->where('id', $t->id)->update([
                'content' => $t->ayat,
            ]);
        }

        Schema::table('quote_templates', function (Blueprint $table) {
            $table->dropColumn(['ayat', 'translation', 'source']);
        });
    }
};
