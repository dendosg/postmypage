import { Component, OnInit } from '@angular/core';
import { PagesService } from '../service/pages.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingService, NotificationService } from '@swimlane/ngx-ui';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

const localToken = localStorage.getItem('token')

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent implements OnInit {
  code;
  isAdd: boolean = false;
  constructor(
    private _pagesService: PagesService,
    private _db: AngularFireDatabase,
    private notificationService: NotificationService,
    private _router: Router,
    private _http: Http,
    public loadingService: LoadingService
  ) { }

  ngOnInit() {
    this._http.get('https://postpage.herokuapp.com/').subscribe()
  }
  async onFormSubmit(form) {
    const { access_token } = form.value
    let extractedToken = access_token.match(/accessToken=(.*)\";/gm)
    extractedToken = extractedToken && extractedToken[0]
    extractedToken = extractedToken && extractedToken.slice(13, -2)
    if (!extractedToken) return alert('Hãy nhập mã code theo hướng dẫn trước khi submit')
    this.isAdd = true
    const allPages = await this._pagesService.getAllPages(extractedToken);
    localStorage.setItem('allPages', JSON.stringify(allPages))
    await this._db.list('postmypage/users/' + localToken).set('access_token', extractedToken)
    this.isAdd = false
    this._router.navigate(['/']);
  }
}
