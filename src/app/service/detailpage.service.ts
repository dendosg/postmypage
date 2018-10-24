import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class DetailpageService {
  constructor(private _http: Http) { }
  getFeedOfPage(query, callback) {
    this._http.get(query).subscribe(res => {
      let resJson = res.json()
      let data = resJson.data
      let paging = resJson.paging
      callback(undefined, data, paging)
    })
  }
}
