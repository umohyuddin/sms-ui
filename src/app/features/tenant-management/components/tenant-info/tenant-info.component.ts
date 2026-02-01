import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { AcademicYearResponse } from '../../models/AcademicYearResponse';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { ActivatedRoute } from '@angular/router';
import { AcademicYearManagementService } from '../../services/academic-year-management.service';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ToasterComponent } from '../../../../shared/components/toaster/toaster.component';


@Component({
  selector: 'app-tenant-info',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, ToasterComponent, LoaderComponent],
  templateUrl: './tenant-info.component.html',
  styleUrls: ['./tenant-info.component.css']
})
export class TenantInfoComponent {
  @ViewChild('toaster') toaster!: ToasterComponent;
  loading: boolean = false;
  loaderMessage = 'Processing...';
  academicYearData?: AcademicYearResponse;
  routedId!: string;

  constructor(
    private academicYearService: AcademicYearManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('Academic Year ID from route:', this.routedId);

    if (this.routedId) {
      this.getAcademicYearDetails(this.routedId);
    } else {
      console.warn('No Academic Year ID found in route.');
    }
  }

  getAcademicYearDetails(routedId: string): void {
    this.academicYearService.getAcademicYearById(routedId).subscribe({
      next: (response) => {
        console.log('📦 Response Body:', response.body);
        this.academicYearData = response.body ?? undefined;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    });
  }

  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }

  // Optional helper methods for safe access
  getAcademicYearName(): string {
    return this.academicYearData?.name ?? 'N/A';
  }

  isCurrentYear(): boolean {
    return this.academicYearData?.isCurrent ?? false;
  }

  isLocked(): boolean {
    return this.academicYearData?.isLocked ?? false;
  }

  toggleLock(): void {
  if (!this.academicYearData) return;

  // Show loader
  this.loading = true;
  this.loaderMessage = 'Updating Academic Year...';

  // Toggle lock state
  const newLockState = !this.academicYearData.isLocked;

  this.academicYearService.makeYearLocked(this.routedId, {
    ...this.academicYearData,
    isLocked: newLockState
  }).subscribe({
    next: (response) => {
      // Update local data
      const action = newLockState ? 'Locked' : 'Unlocked';
      this.toaster.show(`Academic Year ${action} successfully!`, 'success');
    },
    error: (error) => {
      console.error('❌ Error updating academic year:', error);
      this.toaster.show('Failed to update Academic Year. Please try again.', 'error');
         this.loading = false;
    },
    complete: () => {
      this.loading = false; // hide loader always on completion
    }
  });
}

  makeArchive(): void {
    if (!this.academicYearData) return;

    this.loading = true;
    this.loaderMessage = 'Archiving Academic Year...';

    this.academicYearService.archiveAcademicYear(this.routedId, {
      ...this.academicYearData,
      status: 'ARCHIVED'
    }).subscribe({
      next: () => {
        // this.academicYearData = {
        //   ...this.academicYearData,
        //   status: 'ARCHIVED'
        // };
        this.toaster.show('Academic Year archived successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error archiving academic year:', error);
        this.toaster.show('Failed to archive Academic Year. Please try again.', 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


   closeYear(): void {
    if (!this.academicYearData) return;

    this.loading = true;
    this.loaderMessage = 'Closing Academic Year...';

    const payload: AcademicYearResponse = {
      ...this.academicYearData,
      name: this.academicYearData.name ?? '',
      status: 'CLOSED'
    };

    this.academicYearService.closeAcademicYear(this.routedId, payload).subscribe({
      next: () => {
        // this.academicYearData = {
        //   ...this.academicYearData,
        //   status: 'CLOSED'
        // };
        this.toaster.show('Academic Year closed successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error closing academic year:', error);
        this.toaster.show('Failed to close Academic Year. Please try again.', 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }  });
  }

   activateYear(): void {
    if (!this.academicYearData) return;

    this.loading = true;
    this.loaderMessage = 'Activating Academic Year...';

    this.academicYearService.activateAcademicYear(this.routedId).subscribe({
      next: () => {
        // this.academicYearData = {
        //   ...this.academicYearData,
        //   status: 'ACTIVE',
        //   isCurrent: true
        // };
        this.toaster.show('Academic Year activated successfully!', 'success');
      },
      error: (error) => {
        console.error('❌ Error activating academic year:', error);
        this.toaster.show('Failed to activate Academic Year. Please try again.', 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  
  deleteYear(): void {
    if (!this.academicYearData) return;

    this.loading = true;
    this.loaderMessage = 'Deleting Academic Year...';

    this.academicYearService.deleteAcademicYear(this.routedId).subscribe({
      next: () => {
        this.toaster.show('Academic Year deleted successfully!', 'success');
        //this.academicYearData = undefined;
      },
      error: (error) => {
        console.error('❌ Error deleting academic year:', error);
        this.toaster.show('Failed to delete Academic Year. Please try again.', 'error');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
  lifecycle = [
  { label: 'DRAFT', completed: true },
  { label: 'ACTIVE', completed: true },
  { label: 'CLOSED', completed: true },
  { label: 'LOCKED', completed: true },
  { label: 'ARCHIVED', current: true },
];

}
