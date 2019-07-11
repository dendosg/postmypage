import { Component, OnInit } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';
import { NotificationService } from '@swimlane/ngx-ui';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  token;
  password;
  public loading: boolean = false;
  constructor(
    private _loginservice: LoginService,
    private _router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    let token = this._loginservice.getLocalToken()
    if (token) {
      this._router.navigate(['/dashboard'])
    } else {
      console.log('not login')
    }
  }
   
  onFormSubmit(from) {
    let formvalue = from.value
    this.loading = true
    if (formvalue.token && formvalue.password) {
      this._loginservice.authenticate(formvalue.token, formvalue.password, (message, success) => {
        this.loading = false
        if (success) {
          window.location.reload()
        } else {
          alert(message)
        }
      })
    } else {
      alert('Hãy nhập key và password')
    }

  }

}
