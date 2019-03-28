import { Component, OnInit, Input } from "@angular/core";
import { NewcommentService } from "../../service/newcomment.service";

@Component({
  selector: "app-repcmt",
  templateUrl: "./repcmt.component.html",
  styleUrls: ["./repcmt.component.css"]
})
export class RepcmtComponent implements OnInit {
  @Input() commentInfo;
  constructor(private _newcommentservice: NewcommentService) {}
  replyContent = "";
  arrReply = [];
  ngOnInit() {}

  reply() {
    const { id, access_token } = this.commentInfo;
    // let replyContent = '@[' + commentInfoJson.cmt.from.id + ':0] ' + this.replyContent;
    this._newcommentservice
      .postComment(id, this.replyContent, access_token)
      .subscribe(res => {
        this.arrReply.push({
          created_time: new Date(),
          message: this.replyContent,
          access_token,
          id: res["id"]
        });
        this.replyContent = "";
      });
  }
}
