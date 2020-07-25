import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';
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
  getInfoPage(access_token) {
    const fields = [
      "description",
      "checkins",
      "new_like_count",
      "fan_count",
      "name"
    ];
    const query = `https://graph.facebook.com/v2.6/me?fields=${fields.join(',')}&access_token=${access_token}` 
    return this._http.get(query)
  }
}
