import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { FormName } from 'src/app/shared/enums/form-name.enum';
import { NotificationType } from 'src/app/shared/enums/notification-type.enum';
import { UserType } from 'src/app/shared/enums/user-type.enum';
import { FormNameCls } from 'src/app/shared/models/form-name';
import { LocationPatientStatus } from 'src/app/shared/models/location-patient-status';
import { PatientZonalCount } from 'src/app/shared/models/patient-zonal-count';
import { PatientStatusCounts } from 'src/app/shared/models/patients-status-count';
import { Constants } from 'src/app/util/Constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit, AfterViewInit {

  @ViewChild('dairyComponent') dairyComponent: ElementRef;
  @ViewChild('sigoffForm') sigoffForm: ElementRef;
  @ViewChild('completeForm') completeForm: ElementRef;

  droppedIn: boolean = false;
  activeEvent = '';
  originalX = '';
  originalY = '';
  _zones = [];

  public FormsName = FormName;
  public userCount: number = 0;
  public patientStatusCounts: PatientStatusCounts = new PatientStatusCounts();
  public patientZonalCount: PatientZonalCount;
  public patientsCounts: Array<LocationPatientStatus> = [];
  public userCourses: Array<any> = [];
  public signoffFormCounts: FormNameCls = new FormNameCls();
  public completeFormCounts: FormNameCls = new FormNameCls();
  public activeTab: number = 1;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService, private dashboardService: DashboardService) { super(); }

  ngOnInit(): void { }

  ngAfterViewInit(): void {

    window.setTimeout(function () {
      this.initDrag();
    }.bind(this), 500);

    if (this.currentUserRole == UserType.Admin) {
      this.getUserCourses()
    }
    if (this.currentUserRole == UserType.Admin || this.currentUserRole == this.userType.SuperUser) {
      this.SetLoading(true);
      let userId = JSON.parse(localStorage.getItem('_identity')).id;
      this.userService.getPendingSignoff(userId).subscribe(response => {
        if (response) {
          this.signoffFormCounts.patient = response.filter(x => x.entity == FormName.Patient).length;
          this.signoffFormCounts.riskAssessment = response.filter(x => x.entity == FormName.RiskAssessment).length;
          this.signoffFormCounts.sharedPathway = response.filter(x => x.entity == FormName.SharedPathway).length;
          this.signoffFormCounts.recoveryStar = response.filter(x => x.entity == FormName.RecoveryStar).length;
          this.signoffFormCounts.progressNote = response.filter(x => x.entity == FormName.ProgressNote).length;
          this.signoffFormCounts.moveOnFunctional = response.filter(x => x.entity == FormName.MoveOnFunctional).length;
          this.signoffFormCounts.form13 = response.filter(x => x.entity == FormName.Form13).length;
          this.signoffFormCounts.form15 = response.filter(x => x.entity == FormName.Form15).length;
          this.signoffFormCounts.form17 = response.filter(x => x.entity == FormName.Form17).length;
          this.signoffFormCounts.form2 = response.filter(x => x.entity == FormName.Form2).length;
          this.signoffFormCounts.form7 = response.filter(x => x.entity == FormName.Form7).length;
          this.signoffFormCounts.form8 = response.filter(x => x.entity == FormName.Form8).length;
          this.signoffFormCounts.form9 = response.filter(x => x.entity == FormName.Form9).length;
          this.signoffFormCounts.form10 = response.filter(x => x.entity == FormName.Form10).length;
          this.signoffFormCounts.form12 = response.filter(x => x.entity == FormName.Form12).length;
          this.signoffFormCounts.form14 = response.filter(x => x.entity == FormName.Form14).length;
          this.signoffFormCounts.form16 = response.filter(x => x.entity == FormName.Form16).length;
          this.signoffFormCounts.form11 = response.filter(x => x.entity == FormName.Form11).length;
          this.signoffFormCounts.form19 = response.filter(x => x.entity == FormName.Form19).length;
          this.signoffFormCounts.form20 = response.filter(x => x.entity == FormName.Form20).length;
          this.signoffFormCounts.form21 = response.filter(x => x.entity == FormName.Form21).length;
        }
      }, err => {
        console.error(err.error);
      })
      this.SetLoading(false);
    }
    if (this.currentUserRole == this.userType.Admin || this.currentUserRole == this.userType.SuperUser) {
      this.getUserCount();
      this.getPatientStatusCount();
      this.getPatientZonalCount();
    }
    if (this.currentUserRole != UserType.WECAdmin && this.currentUserRole != UserType.Auditor) {
      this.formsToAudits();
    }

    if (this.route.snapshot.queryParamMap.get('notificationType')) {
      if (NotificationType.TaskAssigned == Number(this.route.snapshot.queryParamMap.get('notificationType'))) {
        this.setScrollingOffset(this.dairyComponent);
      }
      else if (NotificationType.FormSignOff == Number(this.route.snapshot.queryParamMap.get('notificationType'))) {
        this.setScrollingOffset(this.sigoffForm);
      }
      if (NotificationType.AuditForm == Number(this.route.snapshot.queryParamMap.get('notificationType'))) {
        this.setScrollingOffset(this.completeForm);
      }
    }

  }

  private getUserCount() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    if (this.currentUserRole == this.userType.Admin) {
      this.userService.getUserCount(careHomeId).subscribe(response => {
        if (response) {
          this.userCount = response;
        }
      }, err => {
        console.error(err.error);
      })
    } else {
      this.userService.getUserCount(careHomeId, this.currentUserId).subscribe(response => {
        if (response) {
          this.userCount = response;
        }
      }, err => {
        console.error(err.error);
      })
    }
    this.SetLoading(false);
  }

  initDrag() {
    var zones = document.getElementsByClassName('zone');
    for (var i = 0; i < zones.length; i++) {
      zones.item(i).addEventListener('dragenter', this.handleDragEnter, false);
      zones.item(i).addEventListener('dragleave', this.handleDragLeave, false);
      zones.item(i).addEventListener('drop', this.handleDragDrop.bind(this), false);
      var rect = (zones.item(i) as HTMLDivElement).getBoundingClientRect();
      this._zones.push({ id: zones.item(i).getAttribute('id'), x: rect.x, y: rect.y, w: rect.width, h: rect.height });
    }

    var patients_arr = document.getElementsByClassName('patient-container');
    for (var i = 0; i < patients_arr.length; i++) {
      patients_arr.item(i).addEventListener('dragstart', this.handleDragStart.bind(this), false);
      patients_arr.item(i).addEventListener('dragend', this.handleDragEnd.bind(this), false);
      patients_arr.item(i).addEventListener('touchstart', this.handleTouchStart.bind(this), false);
      patients_arr.item(i).addEventListener('touchmove', this.handleTouchMove.bind(this), false);
      patients_arr.item(i).addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }
  }

  handleDragEnter(e) {
    // console.log("You are dragging over the " + e.target.getAttribute('id'));
  }

  handleDragLeave(e) {
    // console.log("You left the " + e.target.getAttribute('id'));
  }

  handleDragDrop(e) {
    e.preventDefault();
    var element_id = e.dataTransfer.getData("text");
    let elem = document.getElementById(element_id);
    e.target.appendChild(elem);
    this.droppedIn = true;
    // console.log("handleDragDrop: You droped " + element_id + " into drop zone");
    this.dropped(element_id, e.target.getAttribute('id'));
  }

  handleDragStart(e) {
    // console.log("Dragging the element " + e.target.getAttribute('id'));
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text", e.target.getAttribute('id'));
  }

  handleDragEnd(e) {
    if (this.droppedIn == false) {
      // console.log("You let the " + e.target.getAttribute('id') + " go.");
    }
    this.droppedIn = false;
  }

  handleTouchStart(e) {
    // console.log("Touch start with element " + e.target.getAttribute('id'));
    this.originalX = (e.target.offsetLeft) + "px";
    this.originalY = (e.target.offsetTop) + "px";
    this.activeEvent = 'start';
  }

  handleTouchMove(e) {
    var touchLocation = e.targetTouches[0];
    var pageX = (touchLocation.pageX) + "px";
    var pageY = (touchLocation.pageY) + "px";
    this._('status').innerHTML = pageX + "," + pageY;
    e.target.style.position = "absolute";
    e.target.style.left = pageX;
    e.target.style.top = pageY;
    this.activeEvent = 'move';
  }

  handleTouchEnd(e) {
    let insideZone = false;
    let _zoneId = '';
    e.preventDefault();

    if (this.activeEvent === 'move') {
      var pageX = (parseInt(e.target.style.left));
      var pageY = (parseInt(e.target.style.top));

      this._zones.forEach(_zone => {
        if (pageX >= _zone.x && pageX <= _zone.x + _zone.w && pageY >= _zone.y && pageY <= _zone.y + _zone.h) {
          insideZone = true;
          _zoneId = _zone.id;
        }
      });

      if (insideZone) {
        this._(_zoneId).appendChild(e.target);
        e.target.style.position = "initial";
        this.droppedIn = true;
        // console.log("handleTouchEnd: You droped " + e.target.getAttribute('id') + " into drop zone " + _zoneId);
        this.dropped(e.target.getAttribute('id'), _zoneId)
      }
      else {
        e.target.style.left = this.originalX;
        e.target.style.top = this.originalY;
        // console.log("You let the " + e.target.getAttribute('id') + " go.");
      }
    }

  }

  dropped(element_id, container_id) {
    // console.log(element_id, container_id);
  }

  _(id) {
    return document.getElementById(id);
  }

  public signOffList(formName) {
    this.router.navigate([Constants.routes.signOffList(formName)]);
  }

  public tabChange(index: number) {
    this.activeTab = index;
  }

  private getPatientStatusCount() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

    if (this.currentUserRole == this.userType.Admin) {
      this.dashboardService.getPatientStatusCount(careHomeId).subscribe(response => {
        if (response) {
          this.patientsCounts = response;
          this.patientStatusCounts.activeStatusCount = this.patientsCounts.reduce((a, b) => +a + +b.active, 0);
          this.patientStatusCounts.progressStatusCount = this.patientsCounts.reduce((a, b) => +a + +b.progress, 0);
          this.patientStatusCounts.closedStatusCount = this.patientsCounts.reduce((a, b) => +a + +b.closed, 0);
        }
      }, err => {
        console.error(err.error);
      })
    } else {
      this.dashboardService.getPatientStatusCount(careHomeId, this.currentUserId).subscribe(response => {
        if (response) {
          this.patientsCounts = response;
          this.patientStatusCounts.activeStatusCount = this.patientsCounts.reduce((a, b) => +a + +b.active, 0);
          this.patientStatusCounts.progressStatusCount = this.patientsCounts.reduce((a, b) => +a + +b.progress, 0);
          this.patientStatusCounts.closedStatusCount = this.patientsCounts.reduce((a, b) => +a + +b.closed, 0);
        }
      }, err => {
        console.error(err.error);
      })
    }
    this.SetLoading(false);
  }

  public formsToAudits() {

    this.dashboardService.getPendingAuditForm2(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form2 = response.length;
    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm7(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form7 = response.length;
    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm8(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form8 = response.length;
    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm9(this.currentUserId).subscribe(response => {

      if (response)
        this.completeFormCounts.form9 = response.length;
    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm10(this.currentUserId).subscribe(response => {

      if (response)
        this.completeFormCounts.form10 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm12(this.currentUserId).subscribe(response => {

      if (response)
        this.completeFormCounts.form12 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm13(this.currentUserId).subscribe(response => {

      if (response)
        this.completeFormCounts.form13 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm14(this.currentUserId).subscribe(response => {

      if (response)
        this.completeFormCounts.form14 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm15(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form15 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm16(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form16 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm17(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form17 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm11(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form11 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm19(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form19 = response.length;
      // console.log(this.completeFormCounts);

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm20(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form20 = response.length;

    }, err => {
      console.error(err.error);
    });

    this.dashboardService.getPendingAuditForm21(this.currentUserId).subscribe(response => {
      if (response)
        this.completeFormCounts.form21 = response.length;

    }, err => {
      console.error(err.error);
    });

    // console.log(this.completeFormCounts)
  }

  public auditFormsList(formName) {
    this.router.navigate([Constants.routes.auditFormsList(formName)]);
  }

  private getUserCourses() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.dashboardService.getUserCourses(careHomeId).subscribe(response => {
      if (response)
        this.userCourses = response;
    }, err => {
      console.error(err.error);
    })
  }

  private getPatientZonalCount() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);

    if (this.currentUserRole == this.userType.Admin) {
      this.dashboardService.getPatientZonalCount(careHomeId).subscribe(response => {
        if (response)
          this.patientZonalCount = response;
      }, err => {
        console.error(err.error);
      })
    } else {
      this.dashboardService.getPatientZonalCount(careHomeId, this.currentUserId).subscribe(response => {
        if (response)
          this.patientZonalCount = response;
      }, err => {
        console.error(err.error);
      })
    }
  }

  private setScrollingOffset(viewChildElement: ElementRef) {
    let yCoordinate =
      viewChildElement.nativeElement.getBoundingClientRect().top +
      window.pageYOffset;
    let yOffset = 100;

    window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: "smooth",
    });
  }

  public routeToAuditForm(){
    this.router.navigate([Constants.routes.locationAudits.formTwoOverview()]);
  }
}
