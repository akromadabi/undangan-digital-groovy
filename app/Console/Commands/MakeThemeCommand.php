<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeThemeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'make:theme {name : Name of the theme (e.g. ModernElegant)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new custom theme boilerplate for Undangan Digital';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = trim($this->argument('name'));
        
        // Convert to class name (e.g., AbstractModern) 
        $className = Str::studly($name); 
        
        // Convert to slug (e.g., abstract-modern)
        $slug = Str::slug($name); 

        // 1. Create public assets folders
        $publicPath = public_path("themes/{$slug}");
        $directories = ['demo', 'ornamen', 'background', 'fonts'];
        
        foreach ($directories as $dir) {
            $path = "{$publicPath}/{$dir}";
            if (!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }
        }
        $this->info("✓ Assets directories created at public/themes/{$slug}/ [demo, ornamen, background, fonts]");

        // 2. Create React component
        $stubPath = resource_path('js/stubs/theme_show.stub');
        if (!File::exists($stubPath)) {
            // Pre-create the stubs directory and file if somehow it was deleted
            $this->error("Stub file not found at {$stubPath}. Please ensure resources/js/stubs/theme_show.stub exists.");
            return 1;
        }

        $stub = File::get($stubPath);
        $content = str_replace(
            ['{{ThemeName}}', '{{theme_slug}}'],
            [$className, $slug],
            $stub
        );

        $componentPath = resource_path("js/Pages/Invitation/{$className}Show.jsx");
        
        if (File::exists($componentPath)) {
            $this->error("Component {$className}Show.jsx already exists in resources/js/Pages/Invitation/");
            return 1;
        }

        File::put($componentPath, $content);
        $this->info("✓ React component created at resources/js/Pages/Invitation/{$className}Show.jsx");

        // Success Output
        $this->info("\n🎉 Theme '{$className}' Boilerplate Generated Successfully! 🎉");
        $this->line("--- Next Steps ---");
        $this->line("1. Buka file: <info>resources/js/Pages/Invitation/{$className}Show.jsx</info> dan mulai bangun layout.");
        $this->line("2. Masukkan aset gambar/ornamen ke folder <info>public/themes/{$slug}/ornamen</info>.");
        $this->line("3. Jika Vite belum berjalan, jalankan <comment>npm run dev</comment> agar JSX ini dibaca.");
        $this->line("4. Masuk ke halaman Super Admin -> Themes -> Tambah Tema.");
        $this->line("   - Isi data tema.");
        $this->line("   - Pastikan di database, table themes kolom 'slug' bernilai '{$slug}' atau sesuaikan component namanya.");
        $this->line("   - Component react-nya dipangil di controller atau route dengan nama 'Invitation/{$className}Show'.\n");
        
        return 0;
    }
}
