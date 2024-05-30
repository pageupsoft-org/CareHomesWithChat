import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from 'src/app/services/identity.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { BaseComponent } from 'src/app/shared/components/base/base.component';
import { LoginForm } from 'src/app/shared/forms/login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  public loginForm: LoginForm;
  public forgetPassword: FormGroup;
  public isfogetPassword: boolean = false;

  constructor(private loginService: IdentityService, private messagingService: MessagingService, private fb: FormBuilder) {
    super();
    this.messagingService.requestPermission();
  }

  ngOnInit(): void {
    if (localStorage.getItem('_accessToken')) {
      window.location.pathname = "/dashboard";
    }
    // this.messagingService.receiveMessage();
    this.loginForm = new LoginForm();
  }

  public onSubmit() {
    this.SetLoading(true);
    this.loginService.login(this.loginForm.save()).subscribe(res=> {
      console.log(res);

      localStorage.setItem('_identity', JSON.stringify(res));
      localStorage.setItem('_accessToken', res.accessToken);
      localStorage.setItem('_userType', String(res.role));
      window.location.pathname = "/dashboard";
      // this.SetLoading(false);
    }, error => {
      this.SetLoading(false);
      alert(error.error);
      // this.loginForm.reset();
      this.loginForm.controls['password'].setValue(null);
    })
  }

  public forgotPassword() {
    this.forgetPassword = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
    });
    this.isfogetPassword = true;
  }

  public getPassword() {
    this.SetLoading(true);
    this.loginService.forgotPassword(this.forgetPassword.controls['email'].value).subscribe(res => {
      if (res) {
        alert('User name and password sent on the registered email id')
      } else {
        alert('Something went wrong!! Please contact support');
      }
      this.forgetPassword.reset();
      this.isfogetPassword = false;
      this.SetLoading(false);
    }, error => {
      this.SetLoading(false);
      this.forgetPassword.reset();
      alert(error.error);
    })
  }

}
