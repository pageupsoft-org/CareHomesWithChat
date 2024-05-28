import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormTwentyOneService } from 'src/app/services/form-twenty-one.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { AuditFormTwentyOne } from 'src/app/shared/models/audit-form-twentyone';

@Component({
  selector: 'app-form-twentyone-show',
  templateUrl: './form-twentyone-show.component.html',
  styleUrls: ['./form-twentyone-show.component.scss']
})
export class FormTwentyoneShowComponent extends BaseComponent implements OnInit {

  public auditForm: AuditFormTwentyOne;

  constructor(private route: ActivatedRoute, private formTwentyOneService: FormTwentyOneService) { super(); }

  ngOnInit(): void {
    if (!this.route.snapshot.params['id']) {
      alert('something went wrong!!');
      this.goBack();
    }
    this.getForm21(this.route.snapshot.params['id']);
  }
  
  public goBack() {
    window.history.back();
  }

  private getForm21(id: number) {
    if (id) {
      this.SetLoading(true);
      this.formTwentyOneService.getForm(id).subscribe(
        (response) => {
          if (response) {
            this.auditForm = response;
          }
          this.SetLoading(false);
        },
        (err) => {
          this.SetLoading(false);
          alert(err.error);
        }
      );
    }
  }
}
