import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesService } from '../../services/roles.service';
import { RoleResponse } from '../../models/RoleResponse';

@Component({
    selector: 'app-user-role-assignment',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="user-role-assignment">
      <h5>Available Roles</h5>
      <div class="row">
        <div class="col-lg-4 mb-3" *ngFor="let role of availableRoles">
          <label class="kt-checkbox kt-checkbox--brand">
            <input type="checkbox" 
                   [checked]="isRoleSelected(role.id)" 
                   (change)="toggleRole(role.id)">
            {{ role.name }} ({{ role.code }})
            <span></span>
          </label>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .user-role-assignment {
      padding: 15px;
      border: 1px dashed #ebedf2;
      border-radius: 4px;
    }
  `]
})
export class UserRoleAssignmentComponent implements OnInit {
    @Input() selectedRoleIds: number[] = [];
    @Output() rolesChanged = new EventEmitter<number[]>();

    availableRoles: RoleResponse[] = [];

    constructor(private rolesService: RolesService) { }

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        this.rolesService.getAllRoles().subscribe({
            next: (response) => {
                this.availableRoles = response.body.data || [];
            },
            error: (err) => console.error('Error loading roles:', err)
        });
    }

    toggleRole(id: number) {
        const index = this.selectedRoleIds.indexOf(id);
        if (index > -1) {
            this.selectedRoleIds.splice(index, 1);
        } else {
            this.selectedRoleIds.push(id);
        }
        this.rolesChanged.emit([...this.selectedRoleIds]);
    }

    isRoleSelected(id: number): boolean {
        return this.selectedRoleIds.includes(id);
    }
}
