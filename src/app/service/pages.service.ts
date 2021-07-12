import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";
import {get} from "lodash";
import {NotificationService} from "@swimlane/ngx-ui";

@Injectable()
export class PagesService {
  arrPages = [];
  public baseUrl =
    "https://graph.facebook.com/me/accounts?limit=50&access_token=";

  constructor(private _http: Http, private notificationService: NotificationService) {
  }

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

  // Return all page
  public getAllPages(access_token) {
    let allPages = [];
    return new Promise((resolve, recject) => {
      this.getPages(this.baseUrl + access_token, pages => {
        if (pages.length) {
          allPages = allPages.concat(pages);
        } else {
          resolve(allPages)
        }
      });
    })
  }

  public sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public getPages(endpoint, callback): Promise<any> {
    const httpOptions = {
      headers: new Headers({
        'origin': null
      })
    };

    return this._http
      .get("https://cors-anywhere.herokuapp.com/" + endpoint, httpOptions)
      .toPromise()
      .then(res => res.json())
      .then(async res => {
        const pages = get(res, "data");
        callback(pages);
        const newEndPoint = get(res, "paging.next");
        this.notificationService.create({
          title: 'Import was successful',
          body: `${pages.length} pages`,
          styleType: 'success',
          timeout: 3000,
          rateLimit: false
        })
        await this.sleep(2000)
        if (newEndPoint) return this.getPages(newEndPoint, callback);
        callback([]);
      });
  }
}
