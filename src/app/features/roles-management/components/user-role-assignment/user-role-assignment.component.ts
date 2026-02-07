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
      <div class="kt-portlet">
        <div class="kt-portlet__head">
          <div class="kt-portlet__head-label">
            <h3 class="kt-portlet__head-title">
              <i class="la la-user-shield"></i> Available Roles
            </h3>
          </div>
        </div>
        <div class="kt-portlet__body">
          <div *ngIf="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading roles...</span>
            </div>
            <p class="mt-3 text-muted">Loading available roles...</p>
          </div>

          <div *ngIf="!loading && availableRoles.length === 0" class="alert alert-warning">
            <div class="alert-icon"><i class="flaticon-warning"></i></div>
            <div class="alert-text">No roles available. Please contact your administrator.</div>
          </div>

          <div *ngIf="!loading && availableRoles.length > 0" class="row">
            <div class="col-lg-4 col-md-6 mb-4" *ngFor="let role of availableRoles">
              <div class="role-card" [class.role-card--selected]="isRoleSelected(role.id)">
                <label class="role-card__content">
                  <input type="checkbox" 
                         class="role-card__checkbox"
                         [checked]="isRoleSelected(role.id)" 
                         (click)="toggleRole(role.id)">
                  <div class="role-card__details">
                    <div class="role-card__icon">
                      <i class="la la-shield-alt"></i>
                    </div>
                    <div class="role-card__info">
                      <h5 class="role-card__title">{{ role.name }}</h5>
                      <span class="role-card__code">
                        <i class="la la-key"></i> {{ role.code }}
                      </span>
                      <p class="role-card__description" *ngIf="role.description">
                        {{ role.description }}
                      </p>
                    </div>
                  </div>
                  <span class="role-card__checkmark">
                    <i class="la la-check"></i>
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div *ngIf="!loading && selectedRoleIds.length > 0" class="selected-roles-summary mt-4">
            <div class="kt-separator kt-separator--space-lg kt-separator--border-dashed"></div>
            <div class="alert alert-light">
              <div class="alert-icon"><i class="flaticon-info"></i></div>
              <div class="alert-text">
                <strong>Selected Roles:</strong> 
                <span class="kt-badge kt-badge--primary kt-badge--inline ml-2">
                  {{ selectedRoleIds.length }} role(s)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .user-role-assignment {
      width: 100%;
    }

    .role-card {
      position: relative;
      border: 2px solid #e2e5ec;
      border-radius: 8px;
      background: #fff;
      transition: all 0.3s ease;
      height: 100%;
      cursor: pointer;
      overflow: hidden;
    }

    .role-card:hover {
      border-color: #5867dd;
      box-shadow: 0 4px 12px rgba(88, 103, 221, 0.15);
      transform: translateY(-2px);
    }

    .role-card--selected {
      border-color: #5867dd;
      background: linear-gradient(135deg, #f8f9fd 0%, #fff 100%);
      box-shadow: 0 4px 12px rgba(88, 103, 221, 0.2);
    }

    .role-card--selected .role-card__checkmark {
      opacity: 1;
      transform: scale(1);
    }

    .role-card--selected .role-card__icon {
      background: linear-gradient(135deg, #5867dd 0%, #7e89ed 100%);
      color: #fff;
    }

    .role-card__content {
      display: block;
      padding: 20px;
      margin: 0;
      cursor: pointer;
      position: relative;
    }

    .role-card__checkbox {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .role-card__details {
      display: flex;
      align-items: flex-start;
      gap: 15px;
    }

    .role-card__icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e2e5ec 0%, #f4f5f8 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #5867dd;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    .role-card__info {
      flex: 1;
      min-width: 0;
    }

    .role-card__title {
      font-size: 16px;
      font-weight: 600;
      color: #212529;
      margin: 0 0 6px 0;
      line-height: 1.3;
    }

    .role-card__code {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #74788d;
      font-family: 'Courier New', monospace;
      background: #f4f5f8;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .role-card__code i {
      font-size: 12px;
    }

    .role-card__description {
      margin: 8px 0 0 0;
      font-size: 13px;
      color: #74788d;
      line-height: 1.5;
    }

    .role-card__checkmark {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #5867dd 0%, #7e89ed 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 16px;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.3s ease;
    }

    .selected-roles-summary {
      padding-top: 15px;
    }

    .spinner-border {
      width: 3rem;
      height: 3rem;
    }

    @media (max-width: 991px) {
      .role-card__details {
        gap: 12px;
      }
      
      .role-card__icon {
        width: 40px;
        height: 40px;
        font-size: 20px;
      }
      
      .role-card__title {
        font-size: 15px;
      }
    }
  `]
})
export class UserRoleAssignmentComponent implements OnInit {
    @Input() selectedRoleIds: number[] = [];
    @Output() rolesChanged = new EventEmitter<number[]>();

    availableRoles: RoleResponse[] = [];
    loading: boolean = false;

    constructor(private rolesService: RolesService) { }

    ngOnInit() {
        this.loadRoles();
    }

    loadRoles() {
        this.loading = true;
        console.log('🔄 Loading roles for user assignment...');
        
        this.rolesService.getAllRoles().subscribe({
            next: (response) => {
                console.log('✅ Roles API Response:', response);
                console.log('Response body:', response.body);
                console.log('Response body type:', typeof response.body);
                console.log('Is array:', Array.isArray(response.body));
                
                // Handle multiple possible response formats
                if (response.body) {
                    if (Array.isArray(response.body)) {
                        this.availableRoles = response.body;
                    } else if (response.body.data && Array.isArray(response.body.data)) {
                        this.availableRoles = response.body.data;
                    } else if (response.body.roles && Array.isArray(response.body.roles)) {
                        this.availableRoles = response.body.roles;
                    } else {
                        console.warn('⚠️ Unexpected response format:', response.body);
                        this.availableRoles = [];
                    }
                } else {
                    this.availableRoles = [];
                }
                
                console.log('📋 Parsed available roles:', this.availableRoles);
                console.log('📊 Total roles count:', this.availableRoles.length);
                this.loading = false;
            },
            error: (err) => {
                console.error('❌ Error loading roles:', err);
                console.error('Error details:', {
                    status: err.status,
                    message: err.message,
                    error: err.error
                });
                this.loading = false;
                this.availableRoles = [];
            }
        });
    }

    toggleRole(id: number) {
        const index = this.selectedRoleIds.indexOf(id);
        if (index > -1) {
            this.selectedRoleIds.splice(index, 1);
        } else {
            this.selectedRoleIds.push(id);
        }
        console.log('🔄 Selected roles updated:', this.selectedRoleIds);
        this.rolesChanged.emit([...this.selectedRoleIds]);
    }

    isRoleSelected(id: number): boolean {
        return this.selectedRoleIds.includes(id);
    }
}
