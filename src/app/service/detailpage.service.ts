import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class DetailpageService {
  constructor(private _http: Http) { }
  getFeedOfPage(query) {
    return this._http.get(query)
  }
}
