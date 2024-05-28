import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination/public_api';
import { PatientService } from 'src/app/services/patient.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AdmissionStatus } from 'src/app/shared/enums/admission-status.enum';
import { EthnicOrigin } from 'src/app/shared/enums/ethnicOrigin.enum';
import { Gender } from 'src/app/shared/enums/gender.enum';
import { NameTitle } from 'src/app/shared/enums/name-title.enum';
import { RecordFilterParameter } from 'src/app/shared/models/RecordFilterParameter';
import { Constants } from 'src/app/util/Constants';
import { EnumConverter } from 'src/app/util/EnumConverter';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-service-user-overview',
  templateUrl: './service-user-overview.component.html',
  styleUrls: ['./service-user-overview.component.scss'],
})
export class ServiceUserOverviewComponent
  extends BaseComponent
  implements OnInit
{
  // need to define the type
  patientList: any[] = [];
  nameTitleEnum = NameTitle;
  genderEnum = Gender;
  ethnicEnum = EthnicOrigin;
  public baseUrl: string = environment.baseUrl + 'PdfGenerator/DownloadPatient';
  public admissionStatus = [];
  public status = AdmissionStatus.Active;

  public records: RecordFilterParameter;
  public recordCount: number;
  public lastRecord: number;
  public rotate = true;
  public maxSize = 6;

  constructor(private router: Router, private patientService: PatientService) {
    super();
  }

  ngOnInit(): void {
    this.records = new RecordFilterParameter();
    this.records.skip = 0;
    this.records.top = 10;
    this.records.searchString = '';
    this.records.status = this.status;
    this.records.paginate = true;

    this.admissionStatus = EnumConverter.ConvertEnumToArray(AdmissionStatus);
    this.getPatients();
  }
  
  registerUser() {
    this.router.navigate([Constants.routes.serviceUser()]);
  }

  public getPatients() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.patientService.getAllPatients(this.records, careHomeId).subscribe(
      (response) => {
        if (response) {
          this.patientList = response.items;
          this.patientList = this.patientList.sort((a, b) => {
            if (a.id < b.id) {
              return 1;
            }
            if (a.id > b.id) {
              return -1;
            }
            return 0;
          });
          this.recordCount = response.totalCount;
          this.lastRecord = response.count;
        }
        this.SetLoading(false);
      },
      (error) => {
        alert(error.error);
        this.SetLoading(false);
      }
    );
  }

  public pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    this.lastRecord = event.page * event.itemsPerPage;
    this.records.skip = startItem;
    this.records.paginate = true;
    this.getPatients();
  }

  public patientUpdate(id: number) {
    this.router.navigate([Constants.routes.patientRegistrationEdit(id)]);
  }

  patientView(id: number) {
    this.router.navigate([Constants.routes.patientRegistrationShow(id)]);
  }

  public remove(id: number) {
    if (id) {
      if (confirm('Are you sure you want to delete this record?')) {
        this.SetLoading(true);
        this.patientService.deletePatient(id).subscribe(
          (response) => {
            if (response) {
              alert('Successfully  removed');
              this.getPatients();
            }
            this.SetLoading(false);
          },
          (err) => {
            alert(err.error);
            this.SetLoading(false);
          }
        );
      }
    } else {
      alert('Opps!! Something went wrong.Try again later');
    }
  }

  public searchPatients() {
    this.delay(this.getPatients(), 500);
    // this.getPatients()
  }

  public filter(status){
    this.records.status = status;
    this.getPatients();
  }

  private delay(callback, ms) {
    let timer;
    return function () {
      var context = this,
        args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        callback.apply(context, args);
      }, ms || 0);
    };
  }
}
