import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcademicManagementService } from '../../services/academic-management.service';
import { TimetableEntry } from '../../models/academic.models';

@Component({
    selector: 'app-timetable-manage',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './timetable-manage.html',
    styleUrls: ['./timetable-manage.css']
})
export class TimetableManage implements OnInit {
    days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    timeSlots = [
        { label: '08:00 - 09:00', start: '08:00:00', end: '09:00:00' },
        { label: '09:00 - 10:00', start: '09:00:00', end: '10:00:00' },
        { label: '10:00 - 11:00', start: '10:00:00', end: '11:00:00' },
        { label: '11:00 - 12:00', start: '11:00:00', end: '12:00:00' },
    ];

    sections: any[] = [];
    timetable: TimetableEntry[] = [];
    filters = { standardId: 1, sectionId: '' };

    constructor(private academicService: AcademicManagementService) { }

    ngOnInit(): void {
        // TODO: Load sections
    }

    loadTimetable() {
        if (!this.filters.sectionId) return;
        this.academicService.getSectionTimetable(this.filters.standardId, this.filters.sectionId).subscribe(resp => {
            this.timetable = resp.body || [];
        });
    }

    getEntry(day: string, slot: any): TimetableEntry | undefined {
        return this.timetable.find(e => e.dayOfWeek === day && e.startTime === slot.start);
    }

    onCellClick(day: string, slot: any) {
        const existing = this.getEntry(day, slot);
        if (!existing) {
            // Open modal to add entry (simplified for now)
            const subjectId = prompt('Enter Subject ID');
            const teacherId = prompt('Enter Teacher ID');
            if (subjectId && teacherId) {
                const payload: TimetableEntry = {
                    standardId: this.filters.standardId,
                    sectionId: +this.filters.sectionId,
                    dayOfWeek: day as any,
                    startTime: slot.start,
                    endTime: slot.end,
                    subjectId: +subjectId,
                    teacherId: +teacherId
                };
                this.academicService.saveTimetable(null, payload).subscribe(() => this.loadTimetable());
            }
        }
    }

    deleteEntry(id: number, event: Event) {
        event.stopPropagation();
        if (confirm('Delete this slot?')) {
            this.academicService.deleteTimetable(id).subscribe(() => this.loadTimetable());
        }
    }
}
