import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-action-create-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './action-create-form.component.html',
    styleUrl: './action-create-form.component.css'
})
export class ActionCreateFormComponent {
    @Input() actionForm!: FormGroup;
    @Input() isEditMode = false;
    @Output() submitForm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onSubmit() {
        this.submitForm.emit();
    }

    onCancel() {
        this.cancel.emit();
    }

    get code() { return this.actionForm.get('code'); }
    get name() { return this.actionForm.get('name'); }
    get description() { return this.actionForm.get('description'); }

    getErrorMessage(controlName: string): string {
        const control = this.actionForm.get(controlName);
        if (!control || !control.errors) return '';

        const messages: any = {
            code: {
                required: 'Action Code is required.',
                maxlength: 'Action Code cannot exceed 50 characters.',
                whitespace: 'Action Code cannot be empty or whitespace only.'
            },
            name: {
                required: 'Action Name is required.',
                maxlength: 'Action Name cannot exceed 100 characters.',
                whitespace: 'Action Name cannot be empty or whitespace only.'
            },
            description: {
                maxlength: 'Description cannot exceed 255 characters.'
            }
        };

        for (const error in control.errors) {
            if (messages[controlName] && messages[controlName][error]) {
                return messages[controlName][error];
            }
        }

        return '';
    }
}
