import { Component, OnInit } from '@angular/core';
import { NgxUIModule } from '@swimlane/ngx-ui';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isToken = localStorage.getItem('token')
  constructor(private _loginservice: LoginService, private router: Router) {
    if (!this._loginservice.getLocalToken()) {
      this.router.navigate(['login'])
    }
  }

}
