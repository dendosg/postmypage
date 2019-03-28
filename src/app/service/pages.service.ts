import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class PagesService {
  arrPages = [];
  constructor(private _http: Http) { }
  getExtendedToken(access_token: string) {
    const ngaoDuKyClientId = '249127368869539'
    const ngaoDuKySecret = 'af95ccd133ddea7c52872ddac7c4994f'
    const query = `https://graph.facebook.com/v2.8/oauth/access_token?grant_type=fb_exchange_token&client_id=${ngaoDuKyClientId}&client_secret=${ngaoDuKySecret}&fb_exchange_token=${access_token}`
    return this._http.get(query).toPromise()
      .then(res => res.json())
      .then(res => res.access_token)
      .catch(e => {
        console.log('Co loi xay ra '+e)
        return ''
      })
  }
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
