import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModulesService } from '../../services/modules.service';
import { ModuleResponse } from '../../models/ModuleResponse';

@Component({
  selector: 'app-modules-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modules-info.component.html',
  styleUrl: './modules-info.component.css'
})
export class ModulesInfoComponent {
  @Input() moduleId: number | null = null;
  moduleData?: ModuleResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private modulesService: ModulesService
  ) {}

  ngOnInit(): void {
    let id = this.moduleId;
    if (!id) {
      id = +(this.activatedRoute.snapshot.paramMap.get('id') ?? 0);
    }
    if (id) {
      this.getModuleDetails(id);
    }
  }

  getModuleDetails(moduleId: number): void {
    this.modulesService.getModuleById(moduleId).subscribe({
      next: (response) => {
        this.moduleData = response.body;
      },
      error: (error) => {
        console.error('❌ Request Error Status:', error.status);
        console.error('Message:', error.message);
      }
    });
  }
}
