import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AdmissionStatus } from 'src/app/shared/enums/admission-status.enum';
import { ZoneCategory } from 'src/app/shared/enums/zone-category.enum';
import { PatientAdmission } from 'src/app/shared/models/patient-admission';
import { DialogResult } from 'src/app/util/DialogResult ';
import { LatestLogModalComponent } from '../latest-log-modal/latest-log-modal.component';
import { PatientZoneLogModalComponent } from '../patient-zone-log-modal/patient-zone-log-modal.component';

@Component({
  selector: 'app-zoning-board',
  templateUrl: './zoning-board.component.html',
  styleUrls: ['./zoning-board.component.scss'],
})
export class ZoningBoardComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('patientZoneLog') patientZoneLog: PatientZoneLogModalComponent;
  @ViewChild('logModal') logModal: LatestLogModalComponent;

  @Input() locationId: number;

  public patients: Array<PatientAdmission> = [];
  public patientList: Array<PatientAdmission> = [];
  public patientId: number;
  public fromZone: string;
  public toZone: string;
  public patient: PatientAdmission;

  droppedIn: boolean = false;
  activeEvent = '';
  originalX = '';
  originalY = '';
  _zones = [];
  public zoneCategory = ZoneCategory;
  public showDetails: boolean = false;

  constructor(private patientService: PatientService) {
    super();
  }

  ngOnInit(): void {
    // this.SetLoading(true);

    if (!this.locationId) {
      // alert('Please select location');
      return;
    }
  }

  ngOnChanges() {
    this.SetLoading(true);

    if (!this.locationId) {
      alert('Please select location');
      this.SetLoading(false);
      return;
    }
    if (this.patientList.length <= 0) {
      this.getPatients();
    }
    this.patients = this.patientList.filter(
      (x) => x.locationId == this.locationId
    );
    this.SetLoading(false);
    this.dragInitiate();
  }

  ngAfterViewInit(): void {
    // this.SetLoading(false);
  }

  initDrag() {
    var zones = document.getElementsByClassName('zone');
    for (var i = 0; i < zones.length; i++) {
      zones.item(i).addEventListener('dragenter', this.handleDragEnter, false);
      zones.item(i).addEventListener('dragleave', this.handleDragLeave, false);
      zones
        .item(i)
        .addEventListener('drop', this.handleDragDrop.bind(this), false);
      var rect = (zones.item(i) as HTMLDivElement).getBoundingClientRect();
      this._zones.push({
        id: zones.item(i).getAttribute('id'),
        x: rect.x,
        y: rect.y,
        w: rect.width,
        h: rect.height,
      });
    }

    var patients_arr = document.getElementsByClassName('patient-container');
    for (var i = 0; i < patients_arr.length; i++) {
      patients_arr
        .item(i)
        .addEventListener('dragstart', this.handleDragStart.bind(this), false);
      patients_arr
        .item(i)
        .addEventListener('dragend', this.handleDragEnd.bind(this), false);
      patients_arr
        .item(i)
        .addEventListener(
          'touchstart',
          this.handleTouchStart.bind(this),
          false
        );
      patients_arr
        .item(i)
        .addEventListener('touchmove', this.handleTouchMove.bind(this), false);
      patients_arr
        .item(i)
        .addEventListener('touchend', this.handleTouchEnd.bind(this), false);
    }
  }

  // second executed
  handleDragEnter(e) {
    // console.log.log('You are dragging over the ' + e.target.getAttribute('id'));
  }

  // third executed
  handleDragLeave(e) {
    // console.log.log('You left the ' + e.target.getAttribute('id'));
  }

  // fourth
  handleDragDrop(e) {
    e.preventDefault();
    var element_id = e.dataTransfer.getData('text');
    let elem = document.getElementById(element_id);
    this.toZone = e.target.getAttribute('id');
    this.patientId = element_id;

    if (!this.patientId || !this.toZone || !this.fromZone) {
      return alert('Something went wrong!! try again later');
    }

    if (
      this.toZone == this.fromZone ||
      this.currentUserRole == this.userType.User ||
      this.currentUserRole == this.userType.Auditor
    ) {
      alert("You don't have access to move patients");
      return;
    }

    this.patientZoneLog
      .showModal(this.toZone, this.fromZone, this.patientId)
      .then((result: DialogResult) => {
        if (result == DialogResult.Confirmed) {
          e.target.appendChild(elem);
          // this.getPatients();
          this.showPatinets();
        } else {
          return false;
        }
      });
    // console.log.log('element ' + element_id + ' dropped ', e.target.getAttribute('id'));
    this.droppedIn = true;

    // console.log.log('handleDragDrop: You droped ' + element_id + ' into drop zone');
  }

  // first execute
  handleDragStart(e) {
    // console.log.log('Dragging the element ' + e.target.getAttribute('id'));
    // console.log.log('Dragging the element from zone' + e.target.getAttribute('data-zone'));
    this.fromZone = e.target.getAttribute('data-zone');
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('text', e.target.getAttribute('id'));
  }

  handleDragEnd(e) {
    if (this.droppedIn == false) {
      // console.log.log('You let the ' + e.target.getAttribute('id') + ' go.');
    }
    this.droppedIn = false;
  }

  handleTouchStart(e) {
    // console.log.log('Touch start with element ' + e.target.getAttribute('id'));
    this.originalX = e.target.offsetLeft + 'px';
    this.originalY = e.target.offsetTop + 'px';
    this.activeEvent = 'start';
  }

  handleTouchMove(e) {
    var touchLocation = e.targetTouches[0];
    var pageX = touchLocation.pageX + 'px';
    var pageY = touchLocation.pageY + 'px';
    this._('status').innerHTML = pageX + ',' + pageY;
    e.target.style.position = 'absolute';
    e.target.style.left = pageX;
    e.target.style.top = pageY;
    this.activeEvent = 'move';
  }

  handleTouchEnd(e) {
    let insideZone = false;
    let _zoneId = '';
    e.preventDefault();

    if (this.activeEvent === 'move') {
      var pageX = parseInt(e.target.style.left);
      var pageY = parseInt(e.target.style.top);

      this._zones.forEach((_zone) => {
        if (
          pageX >= _zone.x &&
          pageX <= _zone.x + _zone.w &&
          pageY >= _zone.y &&
          pageY <= _zone.y + _zone.h
        ) {
          insideZone = true;
          _zoneId = _zone.id;
        }
      });

      if (insideZone) {
        this._(_zoneId).appendChild(e.target);
        e.target.style.position = 'initial';
        this.droppedIn = true;
        // console.log('handleTouchEnd: You droped ' + e.target.getAttribute('id') +' into drop zone ' +_zoneId);
        this.dropped(e.target.getAttribute('id'), _zoneId);
      } else {
        e.target.style.left = this.originalX;
        e.target.style.top = this.originalY;
        //  // console.log.log('You let the ' + e.target.getAttribute('id') + ' go.');
      }
    }
  }

  dropped(element_id, container_id) {
    // console.log.log('element ' + element_id + ' dropped ', container_id);
  }

  _(id) {
    return document.getElementById(id);
  }

  public getDetails(patient: PatientAdmission) {
    this.showDetails = true;
    this.logModal.showModal(patient.id).then((result: DialogResult) => {});
  }

  public showPatinets() {
    this.getPatients();
  }

  private getPatients() {
    this.SetLoading(true);
    let careHomeId = Number(
      JSON.parse(localStorage.getItem('_identity')).careHomeId
    );
    this.patientService.getPatientsWithAlert(careHomeId).subscribe(
      (response) => {
        if (response) {
          this.patientList = response;
          this.patients = response.filter((x) =>x.locationId == this.locationId &&x.status == AdmissionStatus.Active);
          this.showDetails = false;
          this.patientId = null;

          this.dragInitiate();
        }
        this.SetLoading(false);
      },
      (error) => {
        alert(error.error);
        this.SetLoading(false);
      }
    );
    this.SetLoading(false);
  }

  private dragInitiate() {
    window.setTimeout(
      function () {
        this.initDrag();
      }.bind(this),
      500
    );
  }
}
