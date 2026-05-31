<?php

namespace App\Traits;

use App\Helpers\ActivityLogger;
use Illuminate\Database\Eloquent\Model;

trait LogsActivity
{
    /**
     * Boot the trait to observe Eloquent model events.
     */
    protected static function bootLogsActivity()
    {
        static::created(function (Model $model) {
            self::logAction('create', $model);
        });

        static::updated(function (Model $model) {
            self::logAction('update', $model);
        });

        // Use 'deleting' to capture attributes and relations before they are removed from the database
        static::deleting(function (Model $model) {
            self::logAction('delete', $model);
        });
    }

    /**
     * Format and log the database action.
     */
    protected static function logAction($type, Model $model)
    {
        if ($model instanceof \App\Models\ActivityLog) {
            return;
        }

        $modelName = class_basename($model);
        
        // Resolve appropriate readable identifier
        $identifier = '';
        if ($model instanceof \App\Models\Rsvp) {
            $identifier = $model->guest?->name ?? "Tamu #{$model->guest_id}";
        } elseif ($model instanceof \App\Models\Wish) {
            $identifier = $model->sender_name ?? $model->guest?->name ?? "Tamu";
        } elseif ($model instanceof \App\Models\User) {
            $identifier = $model->name . " (" . $model->email . ")";
        } elseif ($model instanceof \App\Models\Event) {
            $identifier = $model->event_name ?? "Acara #{$model->id}";
        } elseif ($model instanceof \App\Models\BankAccount) {
            $identifier = ($model->bank_name ?? 'Bank') . " a/n " . ($model->account_name ?? 'Unknown');
        } else {
            $identifier = $model->name ?? $model->title ?? $model->label ?? $model->id;
        }

        // Action verb mapping in Indonesian
        $actionName = '';
        $description = '';
        if ($type === 'create') {
            $actionName = 'Menambahkan';
            $description = "Menambahkan {$modelName} baru: '{$identifier}'";
        } elseif ($type === 'update') {
            $actionName = 'Memperbarui';
            $description = "Memperbarui {$modelName}: '{$identifier}'";
        } elseif ($type === 'delete') {
            $actionName = 'Menghapus';
            $description = "Menghapus {$modelName}: '{$identifier}'";
        } else {
            $actionName = ucfirst($type);
            $description = "{$actionName} {$modelName}: '{$identifier}'";
        }

        // Determine category based on model class name
        $category = 'general';
        $lowerName = strtolower($modelName);
        if (str_contains($lowerName, 'invitation') || str_contains($lowerName, 'section')) {
            $category = 'invitation';
        } elseif (str_contains($lowerName, 'guest')) {
            $category = 'guest';
        } elseif (str_contains($lowerName, 'rsvp')) {
            $category = 'rsvp';
        } elseif (str_contains($lowerName, 'wish') || str_contains($lowerName, 'greeting')) {
            $category = 'wish';
        } elseif (str_contains($lowerName, 'gift')) {
            $category = 'gift';
        } elseif (str_contains($lowerName, 'story')) {
            $category = 'love_story';
        } elseif (str_contains($lowerName, 'event')) {
            $category = 'event';
        } elseif (str_contains($lowerName, 'bankaccount')) {
            $category = 'bank_account';
        } elseif (str_contains($lowerName, 'music')) {
            $category = 'music';
        } elseif (str_contains($lowerName, 'theme')) {
            $category = 'theme';
        } elseif (str_contains($lowerName, 'wallet') || str_contains($lowerName, 'transaction')) {
            $category = 'wallet';
        } elseif (str_contains($lowerName, 'withdrawal')) {
            $category = 'withdrawal';
        } elseif (str_contains($lowerName, 'payment') || str_contains($lowerName, 'subscription')) {
            $category = 'payment';
        } elseif (str_contains($lowerName, 'user')) {
            $category = 'user';
        }

        ActivityLogger::log($type, $category, $description, $model);
    }
}
