<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GlobalSetting extends Model
{
    protected $fillable = [
        'setting_key',
        'setting_value',
        'setting_type',
        'category',
        'description',
    ];

    /**
     * Get a setting value by key.
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = static::where('setting_key', $key)->first();

        if (!$setting)
            return $default;

        return match ($setting->setting_type) {
            'number' => (float) $setting->setting_value,
            'boolean' => filter_var($setting->setting_value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($setting->setting_value, true),
            default => $setting->setting_value,
        };
    }

    /**
     * Set a setting value by key.
     */
    public static function setValue(string $key, $value, string $type = 'string', ?string $category = null): void
    {
        if ($type === 'json' && is_array($value)) {
            $value = json_encode($value);
        }

        static::updateOrCreate(
            ['setting_key' => $key],
            [
                'setting_value' => (string) $value,
                'setting_type' => $type,
                'category' => $category,
            ]
        );
    }
}
