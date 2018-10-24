import { Component, OnInit, Input } from '@angular/core';
import { NewcommentService } from '../../service/newcomment.service';

@Component({
  selector: 'app-repcmt',
  templateUrl: './repcmt.component.html',
  styleUrls: ['./repcmt.component.css']
})
export class RepcmtComponent implements OnInit {
  @Input() commentInfo: object;
  constructor(private _newcommentservice: NewcommentService) { }
  replyContent = '';
  arrReply = []
  ngOnInit() {
  }
  
  reply() {
    let commentInfoJson = JSON.parse(JSON.stringify(this.commentInfo))
    let idComment = commentInfoJson.cmt.id;
    let access_token = commentInfoJson.access_token;
    // let replyContent = '@[' + commentInfoJson.cmt.from.id + ':0] ' + this.replyContent;
    this._newcommentservice.postComment(idComment, this.replyContent, access_token)
    this.arrReply.push({ created_time: new Date(), message: this.replyContent, access_token: access_token })
    this.replyContent = ''


  }
}
