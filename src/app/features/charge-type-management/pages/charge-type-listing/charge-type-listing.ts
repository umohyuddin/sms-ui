import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ChargeTypeListingTableComponent } from '../../components/charge-type-listing-table/charge-type-listing-table.component';

@Component({
    selector: 'app-charge-type-listing',
    standalone: true,
    imports: [CommonModule, ChargeTypeListingTableComponent],
    templateUrl: './charge-type-listing.html',
    styleUrls: ['./charge-type-listing.css']
})
export class ChargeTypeListing {
    constructor(private router: Router) { }

    goToCreate(): void {
        this.router.navigate(ROUTES.FEE.CHARGE_TYPE.CREATE);
    }
}
