import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@swimlane/ngx-ui';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
  }

}
