import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@swimlane/ngx-ui';
import { LoginService } from '../service/login.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit() {
  }

  public logout() {
    this.loginService.removeLocalToken();
    window.location.reload()
  }

}
