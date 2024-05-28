import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Location } from 'src/app/shared/models/location';
import { LocationForm } from 'src/app/shared/forms/location-form'
import { LocationServices } from 'src/app/services/location.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';


@Component({
  selector: 'app-location-create',
  templateUrl: './location-create.component.html',
  styleUrls: ['./location-create.component.scss']
})
export class LocationCreateComponent extends BaseComponent implements OnInit {

  locationForm: LocationForm;
  locationList: Location[] = [];
  @Output() onTabClick: EventEmitter<number> = new EventEmitter<number>();
  showLocations = true;
  isEdit: boolean = false;
  constructor(private locationServices: LocationServices) { super(); }

  ngOnInit(): void {
    this.locationForm = new LocationForm();
    this.getLocations();
  }

  onSubmitNext() {
    this.onSubmit();
    this.onTabClick.emit(4);
  }

  onSubmit() {
    this.locationForm.name.setValue(String(this.locationForm.name.value).trim());
    if (this.isEdit) {
      this.editLocation();
    } else {
      this.addLocation();
    }
  }

  editLocation() {
    this.SetLoading(true);
    let location: Location = this.locationForm.save();
    this.locationServices.updateLocation(location).subscribe(res => {
      if (res) {
        alert("Location updated successfully");
        this.locationForm.reset();
        this.showLocations = true;
      }
      this.SetLoading(false);
    }, err => {
      alert(err.error);
      this.SetLoading(false);
    });
  }

  addLocation() {
    this.SetLoading(true);
    this.locationServices.addLocation(this.locationForm.save()).subscribe(res => {
      if (res) {
        alert("Location added successfully");
        this.locationForm.reset();
        this.showLocations = true;
        this.getLocations();
      }
      this.SetLoading(false);
    },
      err => {
        this.SetLoading(false);
        alert(err.error);
      });
  }

  onTabChange() {
    this.onTabClick.emit(3);
  }

  showLocation() {
    this.showLocations = !this.showLocations;
    if (this.showLocations) {
      this.getLocations();
    } else {
      this.isEdit = false;
      this.locationForm = new LocationForm();
    }
  }

  getLocations() {
    this.SetLoading(true);
    let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
    this.locationServices.getLocations(careHomeId).subscribe(response => {
      if (response) {
        this.locationList = response;
      }
      this.SetLoading(false);
    }, err => {
      this.SetLoading(false);
      alert(err.error);
    })
  }

  edit(location: Location) {
    this.isEdit = true;
    this.SetLoading(true);
    this.showLocations = false;
    this.locationForm = new LocationForm(location);
    this.SetLoading(false);
  }

  remove(id: number) {
    if (window.confirm('Are sure you want to delete this?')) {
      this.SetLoading(true);
      this.locationServices.deleteLocation(id).subscribe(response => {
        if (response) {
          this.getLocations();
        }
        this.SetLoading(false);
      },
        err => {
          this.SetLoading(false);
          alert(err.error);
        })
    }
  }
}
