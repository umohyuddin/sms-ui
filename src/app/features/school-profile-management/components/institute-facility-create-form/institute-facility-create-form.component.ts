import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SchoolProfileManagementService } from '../../services/school-profile-management.service';
import { FacilityTypeResponse } from '../../models/FacilityTypeResponse';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';
import { LoggerService } from '../../../../core/services/logger.service';

interface FacilitySelection {
  facilityTypeId: number;
  facilityTypeName: string;
  description: string;
  capacity: number | null;
  selected: boolean;
}

@Component({
  selector: 'app-institute-facility-create-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ToasterComponent],
  templateUrl: './institute-facility-create-form.component.html',
  styleUrl: './institute-facility-create-form.component.css'
})
export class InstituteFacilityCreateFormComponent implements OnChanges {
  @Input() instituteId?: number;
  @Output() facilitySaved = new EventEmitter<void>();
  @ViewChild(ToasterComponent) private toaster?: ToasterComponent;
  
  facilitySelections: FacilitySelection[] = [];
  isSaving = false;
  isLoadingFacilityTypes = false;

  constructor(
    private schoolProfileManagementService: SchoolProfileManagementService
  ) { }

  ngOnInit(): void {
    this.loadFacilityTypes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['instituteId'] && changes['instituteId'].currentValue) {
      if (this.facilitySelections.length > 0) {
        this.loadExistingFacilities(changes['instituteId'].currentValue);
      }
    }
  }

  private loadFacilityTypes() {
    this.isLoadingFacilityTypes = true;
    this.schoolProfileManagementService.getFacilityTypes().subscribe({
      next: (response) => {
        const types = response.body || [];
        this.facilitySelections = types.map((type: FacilityTypeResponse) => ({
          facilityTypeId: type.id,
          facilityTypeName: type.name,
          description: '',
          capacity: null,
          selected: false
        }));

        if (this.instituteId) {
          this.loadExistingFacilities(this.instituteId);
        }
      },
      error: (error) => {
        console.error('❌ Error loading facility types:', error);
        this.toaster?.show('Failed to load facility types.', 'error');
      },
      complete: () => {
        this.isLoadingFacilityTypes = false;
      }
    });
  }

  private loadExistingFacilities(instituteId: number): void {
    this.schoolProfileManagementService.getInstituteFacilitiesByInstituteId(instituteId).subscribe({
      next: (response) => {
        const facilities = response.body || [];
        const byTypeId = new Map<number, any>();
        facilities.forEach((facility: any) => {
          if (facility?.facilityTypeId != null) {
            byTypeId.set(facility.facilityTypeId, facility);
          }
        });

        this.facilitySelections = this.facilitySelections.map(selection => {
          const existing = byTypeId.get(selection.facilityTypeId);
          if (existing) {
            return {
              ...selection,
              selected: true,
              description: existing.description || '',
              capacity: existing.capacity ?? null
            };
          }

          return {
            ...selection,
            selected: false,
            description: '',
            capacity: null
          };
        });
      },
      error: (error) => {
        console.error('❌ Error loading facilities:', error);
        this.toaster?.show('Failed to load existing facilities.', 'error');
      }
    });
  }

  toggleSelection(selection: FacilitySelection): void {
    selection.selected = !selection.selected;
    if (!selection.selected) {
      selection.description = '';
      selection.capacity = null;
    }
  }

  onSubmit(): void {
    const selectedFacilities = this.facilitySelections.filter(f => f.selected);
    
    if (selectedFacilities.length === 0) {
      this.toaster?.show('Please select at least one facility type.', 'error');
      return;
    }

    if (!this.instituteId) {
      this.toaster?.show('Institute ID is required.', 'error');
      return;
    }

    this.isSaving = true;
    const payload = {
      instituteId: this.instituteId,
      selections: selectedFacilities.map(f => ({
        facilityTypeId: f.facilityTypeId,
        description: f.description || undefined,
        capacity: f.capacity || undefined
      }))
    };

    this.schoolProfileManagementService.createFacilities(payload).subscribe({
      next: () => {
        this.toaster?.show('Facilities created successfully.', 'success');
        setTimeout(() => {
          this.facilitySaved.emit();
          this.resetForm();
        }, 1000);
      },
      error: (error) => {
        console.error('❌ Save Error:', error);
        this.toaster?.show('Failed to create facilities.', 'error');
      },
      complete: () => {
        this.isSaving = false;
      }
    });
  }

  resetForm(): void {
    if (this.instituteId) {
      this.loadExistingFacilities(this.instituteId);
      return;
    }

    this.facilitySelections.forEach(selection => {
      selection.selected = false;
      selection.description = '';
      selection.capacity = null;
    });
  }

  get isLoading(): boolean {
    return this.isSaving || this.isLoadingFacilityTypes;
  }

  get hasSelections(): boolean {
    return this.facilitySelections.some(f => f.selected);
  }
}
