import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../core/const/APP_ROUTES';
import { ChargeTypeInfoComponent } from '../../components/charge-type-info/charge-type-info.component';

@Component({
    selector: 'app-charge-type-details',
    standalone: true,
    imports: [CommonModule, ChargeTypeInfoComponent],
    templateUrl: './charge-type-details.html',
    styleUrls: ['./charge-type-details.css']
})
export class ChargeTypeDetails implements OnInit {
    typeId: string | null = null;

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe(params => {
            this.typeId = params.get('id');
        });
    }

    goToEdit(): void {
        if (this.typeId) {
            this.router.navigate(ROUTES.FEE.CHARGE_TYPE.EDIT(this.typeId));
        }
    }

    goBack(): void {
        this.router.navigate(ROUTES.FEE.CHARGE_TYPE.LIST);
    }
}
