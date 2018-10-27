import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PagesService {
  arrPages = [];
  constructor(private _http: Http) { }

  getAllPage(access_token, callback) {
    console.log('get all page')
    this._http.get('https://postpage.herokuapp.com/?access_token=' + access_token).subscribe(res => {
      let new_access_token = JSON.parse(res.json()).access_token
      new_access_token ? new_access_token = new_access_token : new_access_token = access_token
      let query = 'https://graph.facebook.com/me/accounts?limit=1000&access_token=' + new_access_token
      this._http.get(query).subscribe(res => {
        callback(res.json().data)
      })
    })
  }
}
