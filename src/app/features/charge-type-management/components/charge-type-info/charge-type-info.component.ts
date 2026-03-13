import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChargeTypeManagementService } from '../../services/charge-type-management.service';
import { ChargeTypeResponse } from '../../models/ChargeTypeResponse';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';

@Component({
    selector: 'app-charge-type-info',
    standalone: true,
    imports: [CommonModule, LoaderComponent],
    templateUrl: './charge-type-info.component.html',
    styleUrls: ['./charge-type-info.component.css']
})
export class ChargeTypeInfoComponent implements OnInit {
    @Input() typeId: string | null = null;
    chargeType: ChargeTypeResponse | null = null;
    isLoading = false;
    loadingMessage = '';

    constructor(private chargeTypeService: ChargeTypeManagementService) { }

    ngOnInit(): void {
        if (this.typeId) {
            this.loadChargeType();
        }
    }

    private loadChargeType(): void {
        if (!this.typeId) return;
        this.isLoading = true;
        this.loadingMessage = 'Loading charge type details...';
        this.chargeTypeService.getById(this.typeId).subscribe({
            next: (response) => {
                this.chargeType = response.body;
                this.isLoading = false;
            },
            error: () => {
                this.isLoading = false;
                console.error('Error loading charge type details');
            }
        });
    }

    getInitials(name: string | undefined): string {
        if (!name) return '';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    }
}
