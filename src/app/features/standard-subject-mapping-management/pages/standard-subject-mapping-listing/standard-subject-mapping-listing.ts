import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardSubjectMappingTableComponent } from '../../components/standard-subject-mapping-table/standard-subject-mapping-table.component';

@Component({
    selector: 'app-standard-subject-mapping-listing',
    standalone: true,
    imports: [CommonModule, StandardSubjectMappingTableComponent],
    templateUrl: './standard-subject-mapping-listing.html',
    styleUrls: ['./standard-subject-mapping-listing.css']
})
export class StandardSubjectMappingListing { }
