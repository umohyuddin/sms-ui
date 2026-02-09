import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePermissionService } from '../../services/role-permission.service';
import { PermissionService } from '../../../permission-management/services/permission.service';
import { RolesService } from '../../services/roles.service';
import { LoggerService } from '../../../../core/services/logger.service';
import { forkJoin } from 'rxjs';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { ROUTES } from '../../../../core/const/APP_ROUTES';

interface GroupedPermission {
    moduleId: number;
    moduleName: string;
    resources: {
        resourceId: number;
        resourceName: string;
        permissions: any[];
    }[];
}

@Component({
    selector: 'app-role-permission-assignment',
    standalone: true,
    imports: [CommonModule, FormsModule, LoaderComponent, ToasterComponent],
    templateUrl: './role-permission-assignment.component.html',
    styleUrl: './role-permission-assignment.component.css'
})
export class RolePermissionAssignmentComponent implements OnInit {
    roleId!: number;
    roleName: string = '';
    loading: boolean = false;
    saving: boolean = false;

    groupedPermissions: GroupedPermission[] = [];
    selectedPermissionIds: Set<number> = new Set();

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private rolePermissionService: RolePermissionService,
        private permissionService: PermissionService,
        private rolesService: RolesService,
        private logger: LoggerService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.roleId = +id;
            this.loadData();
        }
    }

    loadData(): void {
        this.loading = true;
        forkJoin({
            role: this.rolesService.getRoleById(this.roleId),
            allPermissions: this.permissionService.getAllPermissions(),
            assignedPermissions: this.rolePermissionService.getRolePermissions(this.roleId)
        }).subscribe({
            next: (res: any) => {
                this.roleName = res.role.body.name;
                this.processPermissions(res.allPermissions);
                this.markAssignedPermissions(res.assignedPermissions.body);
                this.loading = false;
            },
            error: (err) => {
                this.logger.error('Error loading data', err);
                this.loading = false;
            }
        });
    }

    processPermissions(permissions: any[]): void {
        const groups: { [key: number]: GroupedPermission } = {};

        permissions.forEach(p => {
            const moduleId = p.module.id;
            if (!groups[moduleId]) {
                groups[moduleId] = {
                    moduleId: moduleId,
                    moduleName: p.module.name,
                    resources: []
                };
            }

            const resourceId = p.resource.id;
            let resource = groups[moduleId].resources.find(r => r.resourceId === resourceId);
            if (!resource) {
                resource = {
                    resourceId: resourceId,
                    resourceName: p.resource.resourceName,
                    permissions: []
                };
                groups[moduleId].resources.push(resource);
            }

            resource.permissions.push(p);
        });

        this.groupedPermissions = Object.values(groups);
    }

    markAssignedPermissions(assigned: any[]): void {
        this.selectedPermissionIds.clear();
        assigned.forEach(p => {
            this.selectedPermissionIds.add(p.id);
        });
    }

    isPermissionSelected(permissionId: number): boolean {
        return this.selectedPermissionIds.has(permissionId);
    }

    togglePermission(permissionId: number): void {
        if (this.selectedPermissionIds.has(permissionId)) {
            this.selectedPermissionIds.delete(permissionId);
        } else {
            this.selectedPermissionIds.add(permissionId);
        }
    }

    toggleResource(resource: any, event: any): void {
        const checked = event.target.checked;
        resource.permissions.forEach((p: any) => {
            if (checked) {
                this.selectedPermissionIds.add(p.id);
            } else {
                this.selectedPermissionIds.delete(p.id);
            }
        });
    }

    isResourceFullySelected(resource: any): boolean {
        return resource.permissions.every((p: any) => this.selectedPermissionIds.has(p.id));
    }

    isResourcePartiallySelected(resource: any): boolean {
        const selectedCount = resource.permissions.filter((p: any) => this.selectedPermissionIds.has(p.id)).length;
        return selectedCount > 0 && selectedCount < resource.permissions.length;
    }

    toggleModule(module: GroupedPermission, event: any): void {
        const checked = event.target.checked;
        module.resources.forEach(r => {
            r.permissions.forEach(p => {
                if (checked) {
                    this.selectedPermissionIds.add(p.id);
                } else {
                    this.selectedPermissionIds.delete(p.id);
                }
            });
        });
    }

    isModuleFullySelected(module: GroupedPermission): boolean {
        return module.resources.every(r => this.isResourceFullySelected(r));
    }

    isModulePartiallySelected(module: GroupedPermission): boolean {
        let selectedCount = 0;
        let totalCount = 0;
        module.resources.forEach(r => {
            totalCount += r.permissions.length;
            selectedCount += r.permissions.filter(p => this.selectedPermissionIds.has(p.id)).length;
        });
        return selectedCount > 0 && selectedCount < totalCount;
    }

    getModuleTotalPermissions(module: GroupedPermission): number {
        return module.resources.reduce((sum, r) => sum + r.permissions.length, 0);
    }

    getModuleSelectedCount(module: GroupedPermission): number {
        return module.resources.reduce(
            (sum, r) => sum + r.permissions.filter(p => this.selectedPermissionIds.has(p.id)).length,
            0
        );
    }

    saveAssignments(): void {
        this.saving = true;
        const payload = {
            roleId: this.roleId,
            permissionIds: Array.from(this.selectedPermissionIds)
        };

        // Note: Our backend endpoint POST /api/role-permissions/assign adds new permissions.
        // If we want to mirror the selection exactly, we might need to remove all first or update the service.
        // For now, let's assume we want to sync the state. 
        // Usually, a full sync would involve a specialized endpoint.
        // Given the backend handles "assign", let's first remove all and then assign the selected ones.

        this.rolePermissionService.removeAllPermissions(this.roleId).subscribe({
            next: () => {
                if (payload.permissionIds.length > 0) {
                    this.rolePermissionService.assignPermissions(payload).subscribe({
                        next: () => {
                            this.saving = false;
                            this.goBack();
                        },
                        error: (err) => {
                            this.logger.error('Error assigning permissions', err);
                            this.saving = false;
                        }
                    });
                } else {
                    this.saving = false;
                    this.goBack();
                }
            },
            error: (err) => {
                this.logger.error('Error clearing permissions', err);
                this.saving = false;
            }
        });
    }

    goBack(): void {
        this.router.navigate(ROUTES.ROLES.LIST);
    }
}
