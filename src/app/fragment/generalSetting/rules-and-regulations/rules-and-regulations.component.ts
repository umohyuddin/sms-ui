import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalService } from '../../../services/global/global.service';
import { RulesService } from '../../../services/institute/rules.service';
import { Rules } from '../../../models/institute/rules.model';

@Component({
  selector: 'app-rules-and-regulations',
  imports: [CommonModule, FormsModule],
  templateUrl: './rules-and-regulations.component.html',
  styleUrl: './rules-and-regulations.component.scss'
})
export class RulesAndRegulationsComponent implements OnInit {
  rules: Rules = new Rules();
  @ViewChild('editor') editor!: ElementRef<HTMLDivElement>;

  constructor(
    private globalservice: GlobalService,
    private rulesService: RulesService
  ){}

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(){
    this.rulesService.getByInstitute(this.globalservice.getInstitute().id??-1).subscribe({
      next:(res) => {
        if(res != null){this.rules = res;}
        this.ngAfterViewInit();
      },
      error: (err) => {
        console.error("Failed to fetch rules");
      }
    })
  }

  ngAfterViewInit(): void {
    this.editor.nativeElement.innerHTML = this.rules.rules??'';
  }

  //deprecate
  onInput(event: Event) {
    const target = event.target as HTMLElement;
    this.rules.rules = target.innerHTML; // store full HTML
  }

  onSave() {
    this.rules.instituteId = this.globalservice.getInstitute().id??-1;
    this.rules.rules = this.editor.nativeElement.innerHTML;
    if(this.rules.id?false:true)
    {
      this.rulesService.create(this.rules).subscribe({
        next: (res) => { console.log(res); },
        error: (err) => { console.error("Failed to create rules.");}
      });
    }else{
      this.rulesService.update(this.rules).subscribe({
        next: (res) => { console.log(res); },
        error: (err) => { console.error("Failed to update rules.");}
      });
    }
  }

}
