import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from '../../../../core/services/app-config.service';
import { ConcessionManagementService } from '../../services/concession-management.service';
import { CampusResponse } from '../../../campus-management/models/campusResponse';
import { SmsUtil } from '../../../../core/utils/smsUtil';
import { ConcessionResponse } from '../../models/ConcessionResponse';
import { CHARGE_TYPE_CLASSES, RECURRENCE_RULE_CLASSES } from '../../../../core/const/COLOR_CONST';


@Component({
  selector: 'app-concession-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './concession-info.component.html',
  styleUrls: ['./concession-info.component.css']
})
export class ConcessionInfoComponent {
  resourceResponse?: ConcessionResponse;
  routedId!: string;
  RECURRENCE_RULE_CLASSES = RECURRENCE_RULE_CLASSES;
    CHARGE_TYPE_CLASSES = CHARGE_TYPE_CLASSES;
  constructor(
    private concessionManagementService: ConcessionManagementService,
    private route: ActivatedRoute,

  ) { }

  ngOnInit(): void {

    this.routedId = this.route.snapshot.paramMap.get('id') ?? '';
    console.log('ID from route:', this.routedId);
    this.getFeeCatalogDetails(this.routedId);
  }

  getFeeCatalogDetails(routedId: string): void {
    this.concessionManagementService.getConcessionById(routedId).subscribe({
      next: (response) => {
        console.log('  Success Status:', response.status);
        console.log('📦 Response Body:', response.body);
        this.resourceResponse = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      },
      complete: () => {
        console.log('🔚 Request Complete');
      }
    })
  }
  getInitials(name?: string): string {
    return SmsUtil.getInitials(name ?? '');
  }
}
