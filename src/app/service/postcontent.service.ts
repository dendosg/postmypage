import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { async } from '@firebase/util';
import { forEachAsync } from 'forEachAsync';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Ng2ImgurUploader } from 'ng2-imgur-uploader';

const localToken = localStorage.getItem('token')
@Injectable()
export class PostcontentService {
  constructor(private _http: Http, private _db: AngularFireDatabase, private ng2imgur: Ng2ImgurUploader) { }
  image2imgur(image) {
    type ImgurUploadOptions = {
      clientId: string,
      imageData: Blob,
      title?: string
    }
    let uploadOptions: ImgurUploadOptions = {
      clientId: '238ff8a99cfcf80',
      imageData: image
    }
    return this.ng2imgur.upload(uploadOptions)
  }
  uploadOneImage(url_image, access_token) {
    let fd = new FormData
    fd.append('access_token', access_token)
    fd.append('published', 'false')
    fd.append('url', url_image)
    return this._http.post('https://graph.facebook.com/v2.11/me/photos', fd);
  }

  uploadImages(arrImages, access_token, callback) {
    let arrRes = []
    arrImages.forEach(async image => {
      arrRes.push(this.uploadOneImage(image, access_token));
    });
    forkJoin(arrRes).subscribe(res => {
      let huy = JSON.parse(JSON.stringify(res));
      let attached_media = [];
      huy.forEach(res => {
        attached_media.push({ media_fbid: JSON.parse(res._body).id })
      });
      callback(undefined, attached_media);
    })
  }

  getTime(timestring) {
    if (timestring) {
      let dash = timestring.indexOf('|')
      if (dash) {
        let date = timestring.slice(0, dash)
        let time = timestring.slice(dash + 1)
        if (!time) {
          time = '19:00'
        }
        let x = new Date(date + ' ' + time + ' UTC+7').getTime().toString()
        return parseInt(x.slice(0, x.length - 3))
      }
    }

  }
  postStatus(scheduled_publish_time, content, access_token, callback) {
    let option = {
      access_token: access_token,
      message: content,
      scheduled_publish_time: scheduled_publish_time,
      published: !scheduled_publish_time
    }
    let query = 'https://graph.facebook.com/v2.11/me/feed';
    this._http.post(query, option).map(res => res.json()).subscribe(res => {
      callback(undefined, res)
    })
  }
  postImages(scheduled_publish_time, content, arrImages, access_token, callback) {
    this.uploadImages(arrImages, access_token, (err, attached_media) => {
      if (attached_media.length == 1) {
        attached_media.push(attached_media[0])
      }
      let option = {
        access_token: access_token,
        message: content,
        attached_media: attached_media,
        scheduled_publish_time: scheduled_publish_time,
        published: !scheduled_publish_time
      }
      let query = 'https://graph.facebook.com/v2.11/me/feed'
      this._http.post(query, option).map(res => res.json()).subscribe(res => {
        callback(undefined, res)
      })
    })
  }
  postVideo(scheduled_publish_time, content, access_token, callback) {
    let option = {
      access_token: access_token,
      file_url: content.video,
      title: content.title,
      description: content.description,
      scheduled_publish_time: scheduled_publish_time,
      published: !scheduled_publish_time
    }
    let query = 'https://graph.facebook.com/v2.11/me/videos'
    this._http.post(query, option).map(res => res.json()).subscribe(res => {
      callback(undefined, res)
    })
  }
}

