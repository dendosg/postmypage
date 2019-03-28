import { Component, OnInit } from "@angular/core";
import { NewcommentService } from "../service/newcomment.service";
import { DashboardService } from "../service/dashboard.service";
import { LoadingService } from "@swimlane/ngx-ui";
@Component({
  selector: "app-newcomment",
  templateUrl: "./newcomment.component.html",
  styleUrls: ["./newcomment.component.css"]
})
export class NewcommentComponent implements OnInit {
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
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadingService.start();
    this._dashboardservice.getMyPages().subscribe(res => {
      this.arrPages = res;
      this.arrUIDadmin = this.arrPages.map(page => page.id);
      this.getNewCommentOfAllPages();
      this.loadingService.complete();
    });
  }
  onClickCmt(comment) {
    if (!comment) return;
    this.loadingService.start();
    this._newcommentservice.getSubComment(
      comment.comment.id,
      comment.access_token,
      // dataSubComment => {
      //   comment.subCmt = dataSubComment;
      // }
    ).subscribe(res=>{
      console.log(res.json())
    })
    this._newcommentservice
      .getPostInfo(
        comment.id,
        comment.access_token
      )
      .subscribe(infopost => {
        comment.post = infopost;
        this.commentInfo = comment;
        this.loadingService.complete();
      });
  }
  removeCommentByAdmin() {
    this.arrComments = this.arrComments.filter(comment => {
      if (!comment || !comment.comment || !comment.comment.from) return true;
      const { id } = comment.comment.from;
      return !this.arrUIDadmin.includes(id);
    });
  }
  getNewCommentOfAllPages() {
    this.arrPages.forEach(page => {
      let access_token = JSON.parse(JSON.stringify(page)).access_token;
      this._newcommentservice.getCommentOfPage(access_token, data => {
        this.arrComments = this.arrComments.concat(data);
        this.removeCommentByAdmin();
        this.arrComments.sort(function(a, b) {
          let aTime = new Date(a.comment.created_time).getTime();
          let bTime = new Date(b.comment.created_time).getTime();
          return bTime - aTime;
        });
      });
    });
  }
  onPageSelected(access_token) {
    this.loadingService.start();
    this.arrComments = [];
    if (access_token == "all") {
      return this.getNewCommentOfAllPages();
    }
    this._newcommentservice.getCommentOfPage(access_token, data => {
      this.arrComments = data.sort(function(a, b) {
        let aTime = new Date(a.comment.created_time).getTime();
        let bTime = new Date(b.comment.created_time).getTime();
        return bTime - aTime;
      });
      this.removeCommentByAdmin();
      this.loadingService.complete();
    });
  }
}
