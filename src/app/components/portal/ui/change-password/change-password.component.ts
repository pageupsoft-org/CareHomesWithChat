import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {

  changePassword: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService) {
    super();
  }

  ngOnInit(): void {
    this.changePassword = this.fb.group({
      userId: [this.currentUserId],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', Validators.compose([Validators.required,  Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{5,8}$")])],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.checkMatchValidator('newPassword', 'confirmPassword')
    })
  }

  checkMatchValidator(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey];
      let passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
    }
  }

  onSubmit() {
    if(!this.changePassword.valid){
      alert("Something went wrong!!");
      return;
    }
    this.SetLoading(true);
    this.changePassword.controls['userId'].setValue(this.currentUserId);
    this.userService.changePassword(this.changePassword.value).subscribe(res => {
      alert("Password changed successfully ");
      this.changePassword.reset();
      this.SetLoading(false);
    },
      err => {
        this.SetLoading(false);
        alert(err.error);
        console.error(err)
      });
  }
}
