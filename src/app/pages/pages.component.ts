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
  onFormSubmit(form) {
    const {access_token} = form.value
    if(!access_token) return alert('Hãy nhập mã code theo hướng dẫn trước khi submit')
    console.log(access_token)
    this.isAdd = true
    this._pagesService.getAllPage(access_token, (data) => {
      this._db.list('postmypage/users/' + localToken).set('pages', data)
      this._db.list('postmypage/users/' + localToken).set('access_token', access_token)
      window.location.href = '/'
    })
  }
}
