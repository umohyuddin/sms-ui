import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoggerService } from '../../../../core/services/logger.service';
import { PermissionService } from '../../services/permission.service';
import { PermissionResponse } from '../../models/PermissionResponse';
import { ModuleResponse } from '../../models/ModuleResponse';
import { ResourceResponse } from '../../models/ResourceResponse';
import { ActionResponse } from '../../models/ActionResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { JwtService } from '../../../../core/services/jwt.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { forkJoin } from 'rxjs';

interface GroupedModule {
  module: ModuleResponse;
  resources: ResourceResponse[];
  isExpanded: boolean;
}

@Component({
  selector: 'app-permission-create-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent, ToasterComponent],
  templateUrl: './permission-create-form.component.html',
  styleUrl: './permission-create-form.component.css'
})
export class PermissionCreateFormComponent implements OnInit {
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;

  isLoading = false;
  isSaving = false;
  modules: ModuleResponse[] = [];
  resources: ResourceResponse[] = [];
  actions: ActionResponse[] = [];
  existingPermissions: PermissionResponse[] = [];

  groupedData: GroupedModule[] = [];

  // Track selected state: resourceId -> { actionId: boolean }
  selectionMap: Map<number, Set<number>> = new Map();
  // Store permission IDs for existing ones: resourceId -> actionId -> permissionId
  permissionIdMap: Map<number, Map<number, number>> = new Map();
  // Track metadata for existing permissions: permissionId -> PermissionResponse
  permissionMetadataMap: Map<number, PermissionResponse> = new Map();
  // Track modified metadata: permissionId -> Partial<PermissionResponse>
  modifiedMetadata: Map<number, any> = new Map();

  // Modal State
  isMetadataModalOpen = false;
  editingMetadata: any = null;

  constructor(
    private router: Router,
    private permissionService: PermissionService,
    private jwtService: JwtService
  , private logger: LoggerService) { }

  ngOnInit() {
    this.logger.log("ngOnInit called", this.constructor.name);
    this.loadAllData();
  }

  private loadAllData() {
    this.isLoading = true;
    console.log('🔄 Loading all data for permission management...');
    
    forkJoin({
      modules: this.permissionService.getModules(),
      resources: this.permissionService.getResources(),
      actions: this.permissionService.getActions(),
      permissions: this.permissionService.getAllPermissions()
    }).subscribe({
      next: (result) => {
        console.log('✅ Data loaded:', {
          modulesCount: result.modules?.length || 0,
          resourcesCount: result.resources?.length || 0,
          actionsCount: result.actions?.length || 0,
          permissionsCount: result.permissions?.length || 0
        });
        console.log('Modules:', result.modules);
        console.log('Resources:', result.resources);
        console.log('Actions:', result.actions);
        console.log('Permissions:', result.permissions);
        
        this.modules = result.modules || [];
        this.resources = result.resources || [];
        this.actions = result.actions || [];
        this.existingPermissions = result.permissions || [];

        this.processGroupedData();
        this.initializeSelection();
        
        console.log('📊 Grouped data:', this.groupedData);
        console.log('✓ Selection map:', this.selectionMap);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading data:', err);
        this.toaster?.show('Failed to load initial data.', 'error');
        this.isLoading = false;
      }
    });
  }

  private processGroupedData() {
    console.log('🔄 Processing grouped data...');
    console.log('Total modules:', this.modules.length);
    console.log('Total resources:', this.resources.length);
    
    this.groupedData = this.modules.map(mod => {
      const moduleResources = this.resources.filter(res => res.module?.id === mod.id);
      console.log(`Module "${mod.name}": ${moduleResources.length} resources`);
      return {
        module: mod,
        resources: moduleResources,
        isExpanded: true
      };
    }).filter(g => {
      const hasResources = g.resources.length > 0;
      console.log(`Module "${g.module.name}" - hasResources: ${hasResources}`);
      return hasResources;
    });
    
    console.log('📊 Final grouped data count:', this.groupedData.length);
  }

  private initializeSelection() {
    this.selectionMap.clear();
    this.permissionIdMap.clear();
    this.permissionMetadataMap.clear();
    this.modifiedMetadata.clear();

    this.existingPermissions.forEach(perm => {
      if (perm.resource?.id && perm.action?.id) {
        if (!this.selectionMap.has(perm.resource.id)) {
          this.selectionMap.set(perm.resource.id, new Set());
        }
        this.selectionMap.get(perm.resource.id)?.add(perm.action.id);

        if (!this.permissionIdMap.has(perm.resource.id)) {
          this.permissionIdMap.set(perm.resource.id, new Map());
        }
        this.permissionIdMap.get(perm.resource.id)?.set(perm.action.id, perm.id);
        this.permissionMetadataMap.set(perm.id, { ...perm });
      }
    });
  }

  togglePermission(resourceId: number, actionId: number) {
    if (!this.selectionMap.has(resourceId)) {
      this.selectionMap.set(resourceId, new Set());
    }
    const resourceSelections = this.selectionMap.get(resourceId)!;
    if (resourceSelections.has(actionId)) {
      resourceSelections.delete(actionId);
    } else {
      resourceSelections.add(actionId);
    }
  }

  isPermissionSelected(resourceId: number, actionId: number): boolean {
    return this.selectionMap.get(resourceId)?.has(actionId) || false;
  }

  getExistingPermissionId(resourceId: number, actionId: number): number | undefined {
    return this.permissionIdMap.get(resourceId)?.get(actionId);
  }

  toggleActiveStatus(permId: number) {
    const meta = this.permissionMetadataMap.get(permId);
    if (meta) {
      meta.active = !meta.active;
      this.modifiedMetadata.set(permId, {
        ...this.modifiedMetadata.get(permId),
        active: meta.active
      });
    }
  }

  updateMetadata(permId: number, field: string, value: any) {
    const meta = this.permissionMetadataMap.get(permId);
    if (meta) {
      (meta as any)[field] = value;
      this.modifiedMetadata.set(permId, {
        ...this.modifiedMetadata.get(permId),
        [field]: value
      });
    }
  }

  toggleModuleExpansion(group: GroupedModule) {
    group.isExpanded = !group.isExpanded;
  }

  openMetadataEditor(permId: number) {
    const meta = this.permissionMetadataMap.get(permId);
    if (meta) {
      this.editingMetadata = { ...meta };
      this.isMetadataModalOpen = true;
    }
  }

  closeMetadataModal() {
    this.isMetadataModalOpen = false;
    this.editingMetadata = null;
  }

  saveMetadataChanges() {
    if (this.editingMetadata) {
      const permId = this.editingMetadata.id;
      this.updateMetadata(permId, 'name', this.editingMetadata.name);
      this.updateMetadata(permId, 'description', this.editingMetadata.description);
      this.closeMetadataModal();
    }
  }

  onSave() {
    this.isSaving = true;
    const organizationId = this.jwtService.getOrganizationId();

    const toCreate: any[] = [];
    const toDelete: number[] = [];
    const toUpdate: { id: number, payload: any }[] = [];

    // Check for creations and deletions
    this.resources.forEach(res => {
      const selectedActions = this.selectionMap.get(res.id) || new Set<number>();
      const existingActionMap = this.permissionIdMap.get(res.id) || new Map<number, number>();

      // To Create
      selectedActions.forEach(aid => {
        if (!existingActionMap.has(aid)) {
          const action = this.actions.find(a => a.id === aid);
          if (action) {
            toCreate.push({
              organizationId,
              moduleId: res.module?.id,
              resourceId: res.id,
              actionId: aid,
              name: `${action.name} ${res.resourceName} (${res.module?.name})`,
              code: `${res.module?.code}_${res.resourceName.replace(/\s+/g, '_').toUpperCase()}_${action.code}`.toUpperCase(),
              active: true
            });
          }
        }
      });

      // To Delete
      existingActionMap.forEach((permId, aid) => {
        if (!selectedActions.has(aid)) {
          toDelete.push(permId);
        }
      });
    });

    // Check for metadata updates on existing selections (that are NOT being deleted)
    this.modifiedMetadata.forEach((changes, permId) => {
      // Find if this permId is still selected
      let isStillSelected = false;
      this.selectionMap.forEach((actions) => {
        this.permissionIdMap.forEach((actionMap) => {
          actionMap.forEach((id, aid) => {
            if (id === permId && actions.has(aid)) {
              isStillSelected = true;
            }
          });
        });
      });

      if (isStillSelected) {
        const original = this.existingPermissions.find(p => p.id === permId);
        if (original) {
          toUpdate.push({
            id: permId,
            payload: {
              ...original,
              ...changes,
              moduleId: original.module?.id,
              resourceId: original.resource?.id,
              actionId: original.action?.id,
              organizationId
            }
          });
        }
      }
    });

    if (toCreate.length === 0 && toDelete.length === 0 && toUpdate.length === 0) {
      this.toaster?.show('No changes to save.', 'info');
      this.isSaving = false;
      return;
    }

    const createRequests = toCreate.map(payload => this.permissionService.savePermission(null, payload));
    const deleteRequests = toDelete.map(id => this.permissionService.deletePermission(id));
    const updateRequests = toUpdate.map(u => this.permissionService.savePermission(u.id.toString(), u.payload));

    forkJoin([...createRequests, ...deleteRequests, ...updateRequests]).subscribe({
      next: () => {
        this.toaster?.show('Permissions updated successfully.', 'success');
        this.loadAllData();
        this.isSaving = false;
      },
      error: (err) => {
        console.error('Error saving permissions:', err);
        this.toaster?.show('Failed to save some changes.', 'error');
        this.isSaving = false;
      }
    });
  }

  goToPermissionsListing() {
    this.router.navigate(ROUTES.PERMISSIONS.LIST);
  }

  get loadingMessage(): string {
    return this.isSaving ? 'Saving changes...' : 'Loading permissions...';
  }
}
