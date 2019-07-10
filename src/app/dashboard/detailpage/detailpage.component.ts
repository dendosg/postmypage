import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../../service/dashboard.service';
import { DetailpageService } from '../../service/detailpage.service';
import { LoadingService } from '@swimlane/ngx-ui';

import { config } from './detailpage.config';
@Component({
  selector: 'app-detailpage',
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.css']
})
export class DetailpageComponent implements OnInit {
  isDisable: boolean = false;
  UID: string;
  access_token: string;
  next: string;
  isNext: boolean = true;
  previous: string = '';
  arrFeeds = [];
  infoPage
  constructor(
    private _route: ActivatedRoute,
    private _dashboardservice: DashboardService,
    private _detailpageservice: DetailpageService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    // this.loadingService.start()
    this._route.paramMap.subscribe((res: ParamMap) => {
      if (!res) return
      this.UID = res.get('uid')
      this._dashboardservice.getInfoPageFromUid(this.UID, (err, info) => {
        this.infoPage = info
        const query = 'https://graph.facebook.com/v2.12/me/posts?limit=' + config.limit + '&access_token=' + info.access_token + '&fields=' + config.fields
        this._detailpageservice.getFeedOfPage(query).subscribe(res => {
          // this.loadingService.complete()
          let resJson = res.json()
          const { data, paging } = resJson
          this.arrFeeds = data
          if (paging && paging.next) {
            this.next = paging.next;
            this.previous = paging.previous;
          }
        })
      })
    })
  }
  loadMore() {
    // this.loadingService.start()
    if (!this.isNext) {
      // return this.loadingService.complete()
    }

    this._detailpageservice.getFeedOfPage(this.next)
      .subscribe(res => {
        // this.loadingService.complete()
        let resJson = res.json()
        const { data, paging } = resJson
        this.arrFeeds = this.arrFeeds.concat(data)
        if (paging && paging.next) {
          return this.next = paging.next;
        }
        this.isNext = false
      })
  }
}
