import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ExamManagementRoutingModule } from './exam-management-routing-module';
import { ToasterComponent } from '../../shared/components/toaster/toaster.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { DeletePopupComponent } from '../../shared/components/delete-popup/delete-popup.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ExamManagementRoutingModule,
        ToasterComponent,
        LoaderComponent,
        DeletePopupComponent
    ]
})
export class ExamManagementModule { }
