import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';

const localToken = localStorage.getItem('token')

@Injectable()
export class PostcontentService {
  constructor(private _http: Http, private _db: AngularFireDatabase) {
  }

  public uploadXHR(data: FormData, type: string = 'image'): Observable<any> {
    return Observable.create(observer => {
      data.append('upload_preset', "joynit-user")
      const xhr = new XMLHttpRequest;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };
      xhr.open("post", `https://api.cloudinary.com/v1_1/gtappdev/${type}/upload`);
      xhr.send(data);
    })
  }

  public uploadOneImage(url_image, access_token) {
    const data = {
      access_token,
      published: false,
      url: url_image
    }
    return this._http.post('http://54.179.104.207:3000?url=https://graph.facebook.com/v2.11/me/photos', data)
  }

  public uploadImages(arrImages, access_token) {
    const processUploadImages = arrImages.map(image => this.uploadOneImage(image, access_token))
    return forkJoin(processUploadImages).toPromise()
  }

  public postStatus(scheduled_publish_time, content, access_token): Observable<any> {
    const option = {
      access_token, message: content, scheduled_publish_time, published: !scheduled_publish_time
    }
    const query = 'https://graph.facebook.com/v2.11/me/feed';
    return this._http.post("http://54.179.104.207:3000?url=" + query, option)
  }

  public async postImages(scheduled_publish_time, message, arrImages, access_token) {
    let option = {}, query = '';
    if (arrImages.length === 1) {
      option = {
        access_token,
        message,
        url: arrImages[0],
        scheduled_publish_time, published: !scheduled_publish_time
      }
      query = 'https://graph.facebook.com/v2.11/me/photos'
    } else {
      const imagesUploadedResult = await this.uploadImages(arrImages, access_token)
      const attached_media = imagesUploadedResult.map(result => ({
        media_fbid: JSON.parse(result["_body"]).id
      }));
      option = {
        access_token, message, attached_media, scheduled_publish_time, published: !scheduled_publish_time
      }
      query = 'https://graph.facebook.com/v2.11/me/feed'
    }
    return this._http.post("http://54.179.104.207:3000?url=" + query, option)
  }

  public postVideo(scheduled_publish_time, content, access_token) {
    const option = {
      access_token,
      scheduled_publish_time,
      file_url: content.video,
      title: content.title,
      description: content.description,
      published: !scheduled_publish_time
    }
    const query = 'https://graph.facebook.com/v2.11/me/videos'
    return this._http.post("http://54.179.104.207:3000?url=" + query, option)
  }
}

