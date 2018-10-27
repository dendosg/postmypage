import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../service/dashboard.service';

import { LoadingService } from '@swimlane/ngx-ui';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  myPages = [];

  constructor(private _dashboardservice: DashboardService, private loadingService: LoadingService) { }

  ngOnInit() {
    // this.loadingService.start()
    this._dashboardservice.getMyPages().subscribe(pages => {
      pages.forEach(page => {
        const access_token = page['access_token']
        this._dashboardservice.getInfoPage(access_token).subscribe(res => {
          if(!res) return
          res = res.json()
          this.myPages.push(res)
          // this.loadingService.complete()
        })
      });
    })
  }
}
