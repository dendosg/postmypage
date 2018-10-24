import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DashboardService } from '../../service/dashboard.service';
import { DetailpageService } from '../../service/detailpage.service';
import { LoadingService } from '@swimlane/ngx-ui';
@Component({
  selector: 'app-detailpage',
  templateUrl: './detailpage.component.html',
  styleUrls: ['./detailpage.component.css']
})
export class DetailpageComponent implements OnInit {
  isDisable = false;
  UID = '';
  access_token = '';
  next = '';
  isNext = false;
  previous = '';
  arrFeeds = [];
  infoPage;
  constructor(
    private _route: ActivatedRoute,
    private _dashboardservice: DashboardService,
    private _detailpageservice: DetailpageService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this._route.paramMap.subscribe((res: ParamMap) => {
      this.UID = res.get('uid')
      this._dashboardservice.getInfoPageFromUid(this.UID, (err, info) => {
        this.infoPage = info
        let fields = 'message,created_time,shares,comments'
        let limit = 5;
        let query = 'https://graph.facebook.com/v2.12/me/posts?limit=' + limit + '&access_token=' + info.access_token + '&fields=' + fields
        this._detailpageservice.getFeedOfPage(query, (err, data, paging) => {
          if (paging.next) {
            this.next = paging.next;
            this.previous = paging.previous;
          }
          this.arrFeeds = data
          this.isNext = true;
        })
      })
    })
  }
  loadMore() {
    this.loadingService.start()
    if (this.next) {
      this._detailpageservice.getFeedOfPage(this.next, (err, data, paging) => {
        if (paging) {
          if (paging.next) {
            this.next = paging.next;
          } else {
            this.isNext = false
          }
        }
        data.forEach(post => {
          this.arrFeeds.push(post)
          this.loadingService.complete()
        });
      })
    } else {
      console.log('het du lieu roi')
      this.loadingService.complete()
    }
  }
}
