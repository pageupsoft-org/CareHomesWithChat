import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Calendar, CalendarOptions, } from '@fullcalendar/core'; // include this line
import { FullCalendarComponent } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Router } from '@angular/router';
import { ShiftManagementService } from 'src/app/services/roster/shift-management.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LocationServices } from 'src/app/services/location.service';
import { Location } from 'src/app/shared/models/location';
import { formatDate } from '@angular/common';
import { ShowShiftModalComponent } from '../show-shift-modal/show-shift-modal.component';
import { DialogResult } from 'src/app/util/DialogResult ';
import { AddShiftModalComponent } from '../add-shift-modal/add-shift-modal.component';
import { Event } from 'src/app/shared/models/roster-management/event';
import { User } from 'src/app/shared/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rota-management',
  templateUrl: './rota-management.component.html',
  styleUrls: ['./rota-management.component.scss']
})
export class RotaManagementComponent extends BaseComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('showShiftModal') showShiftModal: ShowShiftModalComponent;
  @ViewChild('addShiftModal') addShiftModal: AddShiftModalComponent;

  initialized = false;
  events: Array<Event> = [];
  userList: Array<User> = [];
  calendarOptions: CalendarOptions;
  public locationId: number = 0;
  public userId: number = 0;
  public startDate = new Date();
  public locationList: Array<Location> = [];
  private calendarApi;

  // ======================================
  private month: number = new Date().getMonth() + 1;
  public year = new Date().getFullYear();




  constructor(private router: Router, private shiftManagementServices: ShiftManagementService, private locationService: LocationServices, private userService: UserService) { super(); }

  ngOnInit() {
    this.getLocations();

    // setTimeout(() => {
    //   this.calendarOptions = {
    //     initialView: 'timeGridWeek',
    //     duration: { week: 1 },
    //     // initialDate:  ,
    //     // dateClick: this.onDateClick.bind(this),        
    //     // events: this.events,
    //     //    eventClick: function (event: any) {
    //     //   this.showEvent(event.event.id);
    //     // }.bind(this),

    //   };
    //   this.initialized = true;
    // }, 500);

  }
  // public addShift() {
  //   this.router.navigate([Constants.routes.rosterManagement.addShift()])
  // }

  public showEvent(eventId) {
    this.showShiftModal.showModal(eventId).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getShifts();
      }
    });
  }

  public addShift(shitId?) {
    this.addShiftModal.showModal(shitId).then((result: DialogResult) => {
      if (result == DialogResult.Confirmed) {
        this.getShifts();
      }
    });
  }

  public getShifts() {
    this.events = [];
    // const now = new Date()
    // const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    // const endOfWeek = new Date(now.getFullYear(), now.getMonth(), startOfWeek.getDate() + 7)
    if (this.locationId && this.startDate && this.locationId != 0) {
      this.SetLoading(true);
      this.initialized = false;
      let userId = 0;
      (this.userId && this.userId != 0) ? userId = this.userId : userId = 0;
      this.shiftManagementServices.getShifts(this.locationId, formatDate(this.startDate, 'yyyy-MM-dd', 'en'), userId).subscribe((response) => {
        if (response) {
          response.forEach(element => {
            let obj = new Event();
            obj.id = String(element.id);
            obj.title = element.title;
            obj.start = element.startTime;
            obj.end = element.endTime;
            obj.color = (element.color) ? element.color : '#00887a';
            obj.description = "10";

            this.events.push(obj);
          });
          this.rendarCalendar();
        }
        this.SetLoading(false);
      }, err => {
        alert(err.error);
        this.events = [];
        this.rendarCalendar();
        this.initialized = true;

        this.SetLoading(false);
      })
    }
  }

  public getPrevWeek() {

    let date = new Date(this.calendarComponent.getApi().view.activeStart);
    this.startDate = new Date(new Date().setDate(date.getDate() - 7));

    this.getShifts();
  }

  public getNextWeek() {

    this.startDate = this.calendarComponent.getApi().view.activeEnd;
    this.getShifts();
  }

  public currentWeek() {
    this.startDate = new Date();
    this.getShifts();
  }

  public getUsers(locationId: number) {
    if (locationId) {
      this.SetLoading(true);
      let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
      this.userService.getByLocation(locationId, careHomeId).subscribe((response) => {
        if (response) {
          this.userList = response.filter((x) => x.userType != this.userType.Auditor);
          (this.currentUserRole == this.userType.User) ? this.userId = this.currentUserId : 0;
        }
        this.SetLoading(false);
      },
        (err) => {
          this.SetLoading(false);
          console.error('could not fetch users::' + err.error);
        });
    }
  }

  private getLocations() {
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationService.getLocations(careHomeId).subscribe((response) => {
      if (response.length > 0) {
        // this.locationList = response;
        if (this.currentUserRole != this.userType.Admin) {
          let locationIds = JSON.parse(localStorage.getItem('_identity')).locationIds;
          locationIds.forEach((element) => {
            this.locationList.push(response.filter((x) => x.id == element)[0]);
          });
        } else {
          this.locationList = response;
        }
        this.locationId = (this.locationList[0]) ? this.locationList[0].id : 0;
        (this.locationId) ? this.getUsers(this.locationId) : '';
        this.getShifts();
      }
    },
      (err) => {
        console.error('could not fetch locations ::' + err.error);
      }
    );
  }

  private rendarCalendar() {
    this.calendarOptions = {
      // headerToolbar: {
      //   left: 'prev,next today',
      //   center: 'title',
      //   right: 'dayGridMonth,timeGridWeek,dayGridWeek'
      // },
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin
      ],
      initialView: 'timeGridWeek',
      initialDate: this.startDate,
      duration: { week: 1 },
      weekends: true,

      // firstDay: new Date().getDate(),
      events: this.events,

      eventClick: function (event: any) {
        this.showEvent(event.event.id);
        this.showShiftModal.showModal(event.event.id).then((result: DialogResult) => {
          if (result == DialogResult.Confirmed) {
            this.getShifts();
          }
        });
      }.bind(this),
      navLinkWeekClick: function (weekStart, jsEvent) {

      },
      // eventBackgroundColor:'#1a73e8',
      // eventTextColor:'#fffffc',
      customButtons: {
        prev: {
          text: '<',
          click: this.getPrevWeek.bind(this)
        },
        next: {
          text: '>',
          click: this.getNextWeek.bind(this)
        },
        today: {
          text: "Today",
          click: this.currentWeek.bind(this),
        },
      }

    };
    this.initialized = true;
  }


}