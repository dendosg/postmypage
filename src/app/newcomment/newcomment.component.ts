import { Component, OnInit } from '@angular/core';
import { NewcommentService } from '../service/newcomment.service';
import { DashboardService } from '../service/dashboard.service';
import { LoadingService } from '@swimlane/ngx-ui';
@Component({
  selector: 'app-newcomment',
  templateUrl: './newcomment.component.html',
  styleUrls: ['./newcomment.component.css']
})
export class NewcommentComponent implements OnInit {
  page;
  arrComments = [];
  arrPages = [];
  arrUIDadmin = [];
  arrPostHasComment = [];
  access_token = 'all';
  // rep cmt
  commentInfo;
  constructor(
    private _newcommentservice: NewcommentService,
    private _dashboardservice: DashboardService,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.start()
    this._dashboardservice.getMyPages().subscribe(res => {
      this.arrPages = res
      this.arrPages.forEach(page => {
        this.arrUIDadmin.push(page.id)
      });
      this.getNewCommentOfAllPages()
    })
  }
  onClickCmt(cmt) {
    this.loadingService.start()
    this._newcommentservice.getSubComment(cmt.cmt.id, cmt.access_token, (dataSubComment) => {
      cmt.subCmt = dataSubComment
    })
    this._newcommentservice.getPostInfo(cmt.id, cmt.access_token, (infopost) => {
      cmt.post = infopost
      this.commentInfo = cmt
      this.loadingService.complete()
    })
  }
  removeCommentByAdmin() {
    this.arrComments = this.arrComments.filter(comment => {
      let from_id = comment.cmt.from.id
      return !this.arrUIDadmin.includes(from_id)
    })
    this.loadingService.complete()
  }
  getNewCommentOfAllPages() {
    this.arrPages.forEach(page => {
      let access_token = JSON.parse(JSON.stringify(page)).access_token
      this._newcommentservice.getCommentOfPage(access_token, (data) => {
        this.arrComments = this.arrComments.concat(data)
        this.removeCommentByAdmin()
        this.arrComments.sort(function (a, b) {
          let aTime = new Date(a.cmt.created_time).getTime()
          let bTime = new Date(b.cmt.created_time).getTime()
          return (bTime - aTime);
        });
      })
    });
  }
  onPageSelected(access_token) {
    this.loadingService.start()
    this.arrComments = []
    if (access_token != 'all') {
      this._newcommentservice.getCommentOfPage(access_token, (data) => {
        this.arrComments = data.sort(function (a, b) {
          let aTime = new Date(a.cmt.created_time).getTime()
          let bTime = new Date(b.cmt.created_time).getTime()
          return (bTime - aTime);
        });
        this.removeCommentByAdmin()
        this.loadingService.complete()
      })
    } else {
      // Choose Tat car
      this.getNewCommentOfAllPages()
    }

  }


}
