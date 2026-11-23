<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $task = $this->route('task');
        return $this->user()->can('update', $task);
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:To-do,On Progress,In Review,Completed'],
            'order' => ['nullable', 'integer'],
        ];
    }
}
