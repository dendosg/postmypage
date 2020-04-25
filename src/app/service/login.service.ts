import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AlertService } from '@swimlane/ngx-ui';

@Injectable()
export class LoginService {

  constructor(private _db: AngularFireDatabase, private alertService: AlertService) { }
  getLocalToken() {
    return localStorage.getItem('token')
  }

  removeLocalToken() {
    localStorage.removeItem('token')
  }

  authenticate(token, password, callback) {
    if (!token || !password) return
    this._db.list('postmypage').valueChanges().subscribe(res => {
      const users = res[1]
      if (!res || !users || !users[token]) return callback('Nhập sai key', false)
      localStorage.setItem('token', token)
      let existedPassword = users[token]['password']
      if (!existedPassword) {
        this._db.list('postmypage/users/').update(token, { password })
        console.log('Add User Success')
        return callback('Add User Success', true)
      }
      existedPassword == password ? callback('Login thành công', true) : callback('Sai mật khẩu', false)
    })
  }
}
