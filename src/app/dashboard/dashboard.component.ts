import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../service/dashboard.service';

import {LoadingService} from '@swimlane/ngx-ui';
import {BaseComponent} from '../base.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BaseComponent implements OnInit {
  myPages = [];

  constructor(private _dashboardservice: DashboardService, private loadingService: LoadingService) {
    super();
  }

  ngOnInit() {
    this.loadingService.start()
    this._subscription.add(
      this._dashboardservice.getMyPages().subscribe(async pages => {
        if (!pages || !pages.length) return this.loadingService.complete();
        for (const page of pages) {
          const access_token = page['access_token']
          this._subscription.add(
            this._dashboardservice.getInfoPage(access_token).subscribe(res => {
              this.loadingService.complete()
              if (!res) return
              res = res.json()
              this.myPages.push(res)
            })
          )
          await this.sleep(2000)
        }
      })
    )
  }

  public sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
