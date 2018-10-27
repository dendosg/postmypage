import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { DashboardService } from './dashboard.service';
import { DetailpageService } from './detailpage.service';

@Injectable()
export class NewcommentService {

  arrPages = [];
  constructor(
    private _http: Http,
    private _dashboardservice: DashboardService,
    private _detailpageservice: DetailpageService

  ) { }

  getCommentOfPage(access_token, callback) {
    const arrComments = []
    
    let query = 'https://graph.facebook.com/v2.11/me/feed?fields=comments&limit=50&access_token=' + access_token;
    this._detailpageservice.getFeedOfPage(query).subscribe(res => {
      const resJson = res.json()
      const { data } = resJson
      if (!data) return
      data.forEach(post => {
        if (post.comments && post.comments.data) {
          post.comments.data.forEach(comment => {
            arrComments.push({ id: post.id, access_token, comment })
          });
        }
      });
      callback(arrComments)
    })
  }
  getPostInfo(idPost, access_token, callback) {
    let query = 'https://graph.facebook.com/v2.11/' + idPost + '?fields=full_picture,message&access_token=' + access_token;
    this._http.get(query).subscribe(res => {
      callback(res.json())
    })
  }
  getSubComment(idComment, access_token, callback) {
    let query = 'https://graph.facebook.com/v2.11/' + idComment + '?fields=comments&access_token=' + access_token;
    this._http.get(query).subscribe(res => {
      let resJson = res.json().comments
      if (resJson) {
        if (resJson.data) {
          callback(resJson.data)
        }
      }
    })
  }
  postComment(idComment, message, access_token) {
    console.log('Post Comment')
    const option = { access_token, message, attachment_url: '' }
    const query = `https://graph.facebook.com/v2.11/${idComment}/comments`
    return this._http.post(query, option)
  }
}
