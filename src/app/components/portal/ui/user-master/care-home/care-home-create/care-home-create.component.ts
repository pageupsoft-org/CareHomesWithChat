import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CareHomeService } from 'src/app/services/care-home.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { CareHomeForm } from 'src/app/shared/forms/care-home-form';

@Component({
  selector: 'app-care-home-create',
  templateUrl: './care-home-create.component.html',
  styleUrls: ['./care-home-create.component.scss']
})
export class CareHomeCreateComponent extends BaseComponent implements OnInit {
  @Output() onTabClick: EventEmitter<number> = new EventEmitter<number>();

  careHomeForm: CareHomeForm;
  public userNameError: boolean = false;
  public userNameErrorMsg: string;
  public isEdit: boolean = false;

  constructor(private careHomeService: CareHomeService) { super(); }

  ngOnInit(): void {
    // this.SetLoading(true);
    this.careHomeForm = new CareHomeForm();
  }

  onSubmit() {
    this.SetLoading(true);
    // this.careHomeForm.name.setValue(this.careHomeForm.name.value);
    // this.careHomeForm.contactFirstName.setValue(this.careHomeForm.contactFirstName.value);
    // this.careHomeForm.contactLastName.setValue(this.careHomeForm.contactLastName.value);
    this.careHomeService.addCareHome(this.careHomeForm.save()).subscribe(response => {
      alert("Care-Home added successfully");
      this.careHomeForm.reset();
      this.onTabClick.emit(5);
      this.SetLoading(false);
    },
      error => {
        this.SetLoading(false);
        alert(error.error);
        console.error(error);
      });
  }

  public checkUserName() {
    if (this.careHomeForm.userName == null || this.careHomeForm.userName.value == "") {
      this.userNameError = true;
      this.userNameErrorMsg = "UserName is required";
      return false;
    }else if(String(this.careHomeForm.userName.value.replace(/\s/g, '')).length < 0){
      this.userNameError = true;
      this.userNameErrorMsg = "Minimum 5 characters allowed";
      return false;
    }else if(String(this.careHomeForm.userName.value.replace(/\s/g, '')).length > 30){
      this.userNameError = true;
      this.userNameErrorMsg = "Maximum 30 characters allowed";
      return false;
    }else if(/\s/.test(this.careHomeForm.userName.value)){
      this.userNameError = true;
      this.userNameErrorMsg = "White space not allowed";
      return false;

    }
     else {
      this.userNameError = false;
      this.userNameErrorMsg = "";
      return true;
    }

  }

  private hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

}
