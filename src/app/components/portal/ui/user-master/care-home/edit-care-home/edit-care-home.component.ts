import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CareHomeService } from 'src/app/services/care-home.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';


@Component({
  selector: 'app-edit-care-home',
  templateUrl: './edit-care-home.component.html',
  styleUrls: ['./edit-care-home.component.scss']
})
export class EditCareHomeComponent extends BaseComponent implements OnInit {
  @Input() careHomeId: number;
  @Output() onTabClick: EventEmitter<number> = new EventEmitter<number>();


  constructor(private fb: FormBuilder, private careHomeService: CareHomeService) { super(); }

  public careHomeForm: FormGroup;


  ngOnInit(): void {
    if (this.careHomeId) {
      this.getCareHome();
    } else {
      alert("something went wrong!!");
      this.onTabClick.emit(5);
    }
  }

  public getCareHome() {
    this.SetLoading(true);
    this.careHomeService.getCareHome(this.careHomeId).subscribe(response => {
      this.careHomeForm = this.fb.group({
        id: [response.id],
        name: [response.name, Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,60}$")])],
        contactFirstName: [response.contactFirstName, Validators.compose([Validators.required, Validators.maxLength(250), Validators.minLength(2), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$")])],
        contactLastName: [response.contactLastName, Validators.compose([Validators.maxLength(250), Validators.pattern("^[a-zA-Z][a-zA-Z ]{1,30}$")])],
        contactEmail: [response.contactEmail, Validators.compose([Validators.required, Validators.maxLength(30), Validators.pattern("^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$")])],
        contactNumber: [response.contactNumber, Validators.compose([Validators.required, Validators.pattern("^[0-9]{10,11}$")])],
        mainAddress1: [response.mainAddress1, Validators.compose([Validators.required, Validators.minLength(2),Validators.maxLength(250),])],
        mainAddress2: [response.mainAddress2],
        mainAddress3: [response.mainAddress3],
        mainAddress4: [response.mainAddress4],
        postalCode: [response.postalCode],
        serviceUserLimit: [response.serviceUserLimit, Validators.compose([Validators.required, Validators.min(5)])],
        isActive: [true]
      });
      this.SetLoading(false);

    }, (error) => {
      this.SetLoading(false);
      alert(error.error);
    })
  }

  onSubmit(form) {
    this.SetLoading(true);
    this.careHomeService.updateCareHome(form).subscribe(response => {
      alert("Care-Home updated successfully");

      this.careHomeForm.reset();
      this.onTabClick.emit(5);
      this.SetLoading(false);
    },
      error => {
        this.SetLoading(false);
        alert(error.error);
      });
  }

}
