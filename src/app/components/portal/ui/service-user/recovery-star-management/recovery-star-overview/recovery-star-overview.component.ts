import { Component, Input, OnInit } from '@angular/core';
import { RecoveryStarService } from 'src/app/services/recovery-star.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { RecoveryStar } from 'src/app/shared/models/recovery-star';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-recovery-star-overview',
  templateUrl: './recovery-star-overview.component.html',
  styleUrls: ['./recovery-star-overview.component.scss']
})
export class RecoveryStarOverviewComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() recoveryStarId: any;

  public recoveryStarList: Array<RecoveryStar> = [];
  public showNotification: boolean = true;
  public showRecoveryList: boolean = false;
  public showRecoveryStart: boolean = false;
  public baseUrl: string = environment.baseUrl + "PdfGenerator/DownloadRecoveryStar";

  constructor(private recoveryStarService: RecoveryStarService) { super(); }

  ngOnInit(): void {
    if (this.userData) {
      this.showNotification = false;
      this.showAllRecoveryStar();

    }
  }

  public showAllRecoveryStar() {
    this.showRecoveryList = true;
    this.showRecoveryStart = false
    this.getRecoveryStar();
  }

  private getRecoveryStar() {
    this.recoveryStarService.getRecoveryStars(this.userData.id).subscribe(response => {
      if (response) {
        this.recoveryStarList = response;
        this.recoveryStarList = this.recoveryStarList.sort((a, b) => {
          if (a.id < b.id) {
            return 1
          }
          if (a.id > b.id) {
            return -1
          }
          return 0
        });
      }
    }, err => {
      alert(err.error);
    })
  }

  public createRecoveryStar() {
    this.showRecoveryList = false;
    this.showRecoveryStart = false
    this.recoveryStarId = null;

  }

  public editRecoveryStar(recoveryStarId: number) {
    if (recoveryStarId) {
      this.showRecoveryList = false;
      this.showRecoveryStart = false
      this.recoveryStarId = recoveryStarId;
    }
  }

  public removeRecoveryStar(recoveryStarId: number) {
    if (recoveryStarId) {
      if (confirm("Are you sure you want to delete this record?")) {
        this.SetLoading(true);
        this.recoveryStarService.deleteRecoveryStar(recoveryStarId).subscribe(response => {
          if (response) {
            alert("Successfully  removed");
            this.getRecoveryStar();
          }
          this.SetLoading(false);
        }, err => {
          alert(err.error);
          this.SetLoading(false);
        })
      }
    } else {
      alert('Opps!! Something went wrong.Try again later');
    }
  }

  public showRecoveryStarList() {
    this.showRecoveryList = true;
    this.showRecoveryStart = false
    this.getRecoveryStar();
  }

  public showRecoveryStar(recoveryStarId: RecoveryStar) {
    if (recoveryStarId) {
      this.showRecoveryList = false;
      this.showRecoveryStart = true
      this.recoveryStarId = recoveryStarId;

    }
  }
}
