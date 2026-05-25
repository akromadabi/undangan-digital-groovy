<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id)->where(function ($query) {
                    if ($this->user()->role === 'admin') {
                        $query->where('role', 'admin');
                    } elseif ($this->user()->role === 'super_admin') {
                        $query->where('role', 'super_admin');
                    } else {
                        $query->where('reseller_id', $this->user()->reseller_id);
                    }
                }),
            ],
        ];
    }
}
