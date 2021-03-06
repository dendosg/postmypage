import {Component, OnInit} from "@angular/core";
import {NewcommentService} from "../service/newcomment.service";
import {DashboardService} from "../service/dashboard.service";
import {LoadingService, NotificationService} from "@swimlane/ngx-ui";
import * as moment from 'moment'
import {BaseComponent} from "../base.component";

@Component({
  selector: "app-newcomment",
  templateUrl: "./newcomment.component.html",
  styleUrls: ["./newcomment.component.css"]
})
export class NewcommentComponent extends BaseComponent implements OnInit {
  page;
  arrComments = [];
  arrPages = [];
  arrUIDadmin = [];
  arrPostHasComment = [];
  access_token = "all";
  // rep cmt
  commentInfo;

  constructor(
    private _newcommentservice: NewcommentService,
    private _dashboardservice: DashboardService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    this.loadingService.start();
    this._subscription.add(
      this._dashboardservice.getMyPages().subscribe(res => {
        this.arrPages = res;
        this.arrUIDadmin = this.arrPages.map(page => page.id);
        this.getNewCommentOfAllPages();
        this.loadingService.complete();
      })
    );
  }

  onClickCmt(comment) {
    if (!comment) return;
    this.loadingService.start();
    this._subscription.add(
      this._newcommentservice.getSubComment(
        comment.comment.id,
        comment.access_token,
        // dataSubComment => {
        //   comment.subCmt = dataSubComment;
        // }
      ).subscribe(res => {
        console.log(res.json())
      })
    )
    this._subscription.add(
      this._newcommentservice
        .getPostInfo(
          comment.id,
          comment.access_token
        )
        .subscribe(infopost => {
          comment.post = infopost;
          this.commentInfo = comment;
          this.loadingService.complete();
        })
    )
  }

  removeCommentByAdmin() {
    this.arrComments = this.arrComments.filter(comment => {
      if (!comment || !comment.comment || !comment.comment.from) return true;
      const {id} = comment.comment.from;
      return !this.arrUIDadmin.includes(id);
    });
  }

  public sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async getNewCommentOfAllPages() {
    this.loadingService.start()
    for (const page of this.arrPages) {
      let access_token = JSON.parse(JSON.stringify(page)).access_token;
      this._newcommentservice.getCommentOfPage(access_token, data => {
        const newdata = data.map(item => ({...item, page}))
        this.arrComments = this.arrComments.concat(newdata);
        this.removeCommentByAdmin();
        this.arrComments.sort(function (a, b) {
          let aTime = new Date(a.comment.created_time).getTime();
          let bTime = new Date(b.comment.created_time).getTime();
          return bTime - aTime;
        });
      });
      this.notificationService.create({
        title: page.name,
        body: 'Loaded',
        styleType: 'success',
        timeout: 1,
        rateLimit: false
      })
      await this.sleep(3000)
    }
    this.loadingService.complete()
  }

  public openPageInNewTab(pageId) {
    window.open('http://fb.com/' + pageId, '_blank')
  }

  public onPageSelected(access_token) {
    const page = this.arrPages.find(page => page.access_token === access_token)
    this.loadingService.start();
    this.arrComments = [];
    if (access_token == "all") {
      return this.getNewCommentOfAllPages();
    }
    this._newcommentservice.getCommentOfPage(access_token, data => {
      this.arrComments = data.sort(function (a, b) {
        let aTime = new Date(a.comment.created_time).getTime();
        let bTime = new Date(b.comment.created_time).getTime();
        return bTime - aTime;
      });
      this.removeCommentByAdmin();
      this.arrComments = this.arrComments.map(comment => ({...comment, page}))
      this.loadingService.complete();
    });
  }

  public getDateFormat(time) {
    return moment(time).format('HH[h]mm, DD/MM/YYYY')
  }
}
