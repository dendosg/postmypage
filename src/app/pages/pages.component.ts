import { Component, OnInit } from '@angular/core';
import { PagesService } from '../service/pages.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationService } from '@swimlane/ngx-ui';
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
    private _http: Http
  ) { }

  ngOnInit() {
    this._http.get('https://postpage.herokuapp.com/')
  }
  async onFormSubmit(form) {
    const { access_token } = form.value
    const data = access_token.match(/(?<=accessToken\\\":\\\")(.*)(?=\\\",\\\"useLocalFilePreview)/gm)
    const extractedToken = data && data[0]
    if (!extractedToken) return alert('Hãy nhập mã code theo hướng dẫn trước khi submit')
    this.isAdd = true
    // const extendEdToken = await this._pagesService.getExtendedToken(access_token)
    const allPages = await this._pagesService.getAllPages(extractedToken);
    // return console.log('allPages', allPages)
    await this._db.list('postmypage/users/' + localToken).set('pages', allPages)
    const res = await this._db.list('postmypage/users/' + localToken).set('access_token', extractedToken)
    this._router.navigate(['/']);
  }
}
