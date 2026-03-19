import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AdmissionTypeManagementService } from '../../services/admission-type-management.service';
import { AdmissionTypeResponseDTO } from '../../models/AdmissionTypeResponse';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-admission-type-info',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  providers: [DatePipe],
  templateUrl: './admission-type-info.component.html',
  styleUrls: ['./admission-type-info.component.css']
})
export class AdmissionTypeInfoComponent implements OnInit {
  itemId: string | null = null;
  itemData: AdmissionTypeResponseDTO | null = null;
  isLoading = false;
  loadingMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private admissionTypeService: AdmissionTypeManagementService
  ) {}

  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('id');
    if (this.itemId) {
      this.loadDetails(this.itemId);
    }
  }

  loadDetails(id: string): void {
    this.isLoading = true;
    this.loadingMessage = 'Loading Details...';
    this.admissionTypeService.getAdmissionTypeById(id).subscribe({
      next: (response: any) => {
        this.itemData = response.body;
      },
      error: (error) => {
        console.error('Error fetching details', error);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingMessage = '';
      }
    });
  }

  getInitials(name?: string): string {
    if (!name) return '';
    return name.substring(0, 2).toUpperCase();
  }
}
