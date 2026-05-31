<?php

namespace App\Helpers;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    /**
     * Log a system activity.
     *
     * @param string $activityType create, update, delete, login, other
     * @param string $category invitation, guest, rsvp, etc.
     * @param string $description Human-readable description
     * @param \Illuminate\Database\Eloquent\Model|null $subject
     * @return ActivityLog|null
     */
    public static function log($activityType, $category, $description, $subject = null)
    {
        $user = Auth::user();
        $userId = $user ? $user->id : null;
        
        $role = 'guest';
        if ($user) {
            if ($user->isSuperAdmin()) {
                $role = 'super_admin';
            } elseif ($user->isReseller()) {
                $role = 'reseller';
            } else {
                $role = 'user';
            }
        }

        $payload = null;
        if ($subject && $activityType === 'delete') {
            // Store raw database attributes for exact database restoration
            $payload = $subject->getAttributes();
        }

        try {
            return ActivityLog::create([
                'user_id' => $userId,
                'role' => $role,
                'activity_type' => $activityType,
                'category' => $category,
                'description' => $description,
                'subject_type' => $subject ? get_class($subject) : null,
                'subject_id' => $subject ? $subject->id : null,
                'payload' => $payload,
            ]);
        } catch (\Exception $e) {
            // Silently fail logging if it errors to prevent blocking main database actions
            \Illuminate\Support\Facades\Log::error('Failed to write activity log: ' . $e->getMessage());
            return null;
        }
    }
}
