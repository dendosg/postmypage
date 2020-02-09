import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { get } from "lodash";

@Injectable()
export class PagesService {
  arrPages = [];
  public baseUrl =
    "https://graph.facebook.com/me/accounts?access_token=";
  constructor(private _http: Http) {}
  getExtendedToken(access_token: string) {
    const ngaoDuKyClientId = "249127368869539";
    const ngaoDuKySecret = "af95ccd133ddea7c52872ddac7c4994f";
    const query = `https://graph.facebook.com/v2.8/oauth/access_token?grant_type=fb_exchange_token&client_id=${ngaoDuKyClientId}&client_secret=${ngaoDuKySecret}&fb_exchange_token=${access_token}`;
    return this._http
      .get(query)
      .toPromise()
      .then(res => res.json())
      .then(res => res.access_token)
      .catch(e => {
        console.log("Co loi xay ra " + e);
        return "";
      });
  }
  // public async getAllPage(access_token, callback) {
  //   console.log("get all page", access_token);
  //   const res = await this.getPages(access_token);
  //   console.log("res :", res);
  //   this._http
  //     .get("https://postpage.herokuapp.com/?access_token=" + access_token)
  //     .subscribe(res => {
  //       console.log("res", res);
  //       let new_access_token = JSON.parse(res.json()).access_token;
  //       new_access_token
  //         ? (new_access_token = new_access_token)
  //         : (new_access_token = access_token);
  //       let query =
  //         "https://graph.facebook.com/me/accounts?limit=1000&access_token=" +
  //         new_access_token;
  //       this._http.get(query).subscribe(res => {
  //         callback(res.json().data);
  //       });
  //     });
  // }

  // Return all page
  public getAllPages(access_token) {
    let allPages = [];
    return new Promise((resolve, recject)=>{
      this.getPages(this.baseUrl + access_token, pages => {
        if (pages.length) {
          allPages = allPages.concat(pages);
        } else {
          resolve(allPages)
        }
      });
    })
  }
  public getPages(endpoint, callback): Promise<any> {
    return this._http
      .get(endpoint)
      .toPromise()
      .then(res => res.json())
      .then(res => {
        const pages = get(res, "data");
        callback(pages);
        const newEndPoint = get(res, "paging.next");
        if (newEndPoint) return this.getPages(newEndPoint, callback);
        callback([]);
      });
  }
}
