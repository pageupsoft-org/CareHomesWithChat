import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MySharedPathwayService } from 'src/app/services/my-shared-pathway.service';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { MySharedPathway } from 'src/app/shared/models/my-shared-pathway';
import { User } from 'src/app/shared/models/user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-shared-pathway-overview',
  templateUrl: './my-shared-pathway-overview.component.html',
  styleUrls: ['./my-shared-pathway-overview.component.scss']
})
export class MySharedPathwayOverviewComponent extends BaseComponent implements OnInit {
  @Input() userData: any;
  @Input() sharedPathwayData: any;

  private id: number;
  public sharedPathways: Array<MySharedPathway> = [];
  public showNotification: boolean = false;
  public showPathwayList: boolean = true;
  public showPathway: boolean = false;
  public usersList: User[] = [];
  public baseUrl: string = environment.baseUrl + "PdfGenerator/DownloadSharedPathway";


  constructor(private sharedPathwayService: MySharedPathwayService, private route: ActivatedRoute, private userService: UserService) { super(); }

  ngOnInit(): void {
    if (!this.userData) {
      this.showNotification = true;
      return;
    }
    this.id = this.route.snapshot.params['id'];
    this.getPathways();
    // this.getUsers();
  }

  getPathways() {
    if (this.id) {
      this.SetLoading(true);
      this.sharedPathwayService.getMySharedPathways(this.id).subscribe(response => {
        if (response) {
          this.sharedPathways = response;
          this.sharedPathways = this.sharedPathways.sort((a, b) => {
            if (a.id < b.id) {
              return 1
            }
            if (a.id > b.id) {
              return -1
            }
            return 0
          });
        }
        this.SetLoading(false);
      }, err => {
        alert(err.error);
        this.SetLoading(false);
      })
    }
  }

  public createPathway() {
    this.showPathwayList = false;
    this.showPathway = false;
  }

  public editPathway(pathway: MySharedPathway) {
    if (pathway) {
      this.showPathwayList = false;
      this.showPathway = false
      this.sharedPathwayData = pathway;
    }
  }

  public showSharedPathway(pathway: MySharedPathway) {
    if (pathway) {
      this.showPathwayList = false;
      this.showPathway = true
      this.sharedPathwayData = pathway;
    }
  }

  public removePathway(id: number) {
    if (id) {
      if (confirm("Are you sure you want to delete this record?")) {
        this.SetLoading(true);
        this.sharedPathwayService.deleteSharedPathway(id).subscribe(response => {
          if (response) {
            alert("Successfully  removed");
            this.getPathways();
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

  // private getUsers() {
  //   let careHomeId = Number(JSON.parse(localStorage.getItem('_identity')).careHomeId);
  //   this.userService.getUsers(careHomeId).subscribe(response => {
  //     if (response) {
  //       this.usersList = response;
  //     }
  //   }, err => {
  //     console.error("could not fetch users::" + err.error);
  //   })

  // }

  // public getCompletedBy(userId: number) {
  //   if (userId) {
  //     let userName = '';
  //     this.usersList.forEach((el) => {
  //       if (el.id == userId) {
  //         userName = (el.firstName == null || el.lastName == null) ? el.email : (el.firstName + " " + el.lastName)

  //       }
  //     });
  //     return userName;
  //   }

  // }

  public showPathways() {
    this.showPathwayList = true;
    this.showPathway = false;
    this.getPathways();
  }
}
