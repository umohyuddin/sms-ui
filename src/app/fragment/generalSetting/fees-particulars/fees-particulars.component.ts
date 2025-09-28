import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FeeParticulars } from '../../../models/student/fee-particulars.model';
import { FeesParticularService } from '../../../services/institute/fees-particular.service';
import { GlobalService } from '../../../services/global/global.service';

@Component({
  selector: 'app-fees-particulars',
  imports: [FormsModule, CommonModule ],
  templateUrl: './fees-particulars.component.html',
  styleUrl: './fees-particulars.component.scss'
})
export class FeesParticularsComponent implements OnInit {
  name: string = '';
  feeParticular: FeeParticulars = new FeeParticulars();
  feeParticulars: FeeParticulars[] = [];

  constructor(
    private feesParticularService: FeesParticularService,
    private globalService: GlobalService
  ){}

  ngOnInit(): void {
    this.loadFeesParticulars();
  }

  loadFeesParticulars(){
    this.feesParticularService.getByInstitute(this.globalService.getInstitute().id??-1).subscribe({
      next: (res) =>{
        this.feeParticulars = res;
        this.feeParticular = this.feeParticulars[0]? {... this.feeParticulars[0] }: new FeeParticulars();

      },
      error: (err) => {
        console.log("Failed to fetch feeParticulars.");
      }
    })
  }

  onfeeParticularChange(){
    if(this.feeParticular.name === '--Add New--')
    {
      this.feeParticular = new FeeParticulars();
      this.feeParticular.name = "--Add New--";
    }else{
      this.feeParticular = {...this.feeParticulars.filter(fp => fp.name === this.feeParticular.name)[0]};
    }

  }
  update(){
    if(this.feeParticular.name === '--Add New--')
    {
      this.feeParticular.name = this.name;
      this.feeParticular.id = 0;
      this.feeParticular.instituteId = this.globalService.getInstitute().id??-1;
      this.feesParticularService.craeteFeeParticulars(this.feeParticular).subscribe({
        next: (res)=>{
          console.log(res);
          this.feeParticulars.push({...this.feeParticular});
        },
        error: (err) =>{
          console.error("failed to create fees particulars");
        }

      })
    }else{
      this.feesParticularService.updateFeeParticulars(this.feeParticular).subscribe({
        next: (res)=>{
          console.log(res);
          const index = this.feeParticulars.findIndex(
            fp => fp.name === this.feeParticular.name
          );
          if (index !== -1) {
            // Replace the element at the found index
            this.feeParticulars[index] = { ...this.feeParticular };
          }

        },
        error: (err) =>{
          console.error("failed to update fees particulars");
        }

      })
    }

  }
  

}
