import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
@Injectable()
export class DashboardService {

  constructor(private _http: Http, private _db: AngularFireDatabase) { }
  getMyPages() {
    return this._db.list('postmypage/users/' + localStorage.getItem('token') + '/pages').valueChanges()
  }
  getInfoPageFromUid(UID, callback) {
    this.getMyPages().subscribe(res => {
      var info = res.find(element => element['id'] == UID)
      callback(undefined, info)
    })
  }
  getInfoPage(access_token, callback) {
    let query = 'https://graph.facebook.com/me?access_token=' + access_token
    this._http.get(query).subscribe(res => {
      callback(undefined, res.json())
    })
  }
}
