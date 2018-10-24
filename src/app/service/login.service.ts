import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { AlertService } from '@swimlane/ngx-ui';

@Injectable()
export class LoginService {

  constructor(private _db: AngularFireDatabase,
    private alertService: AlertService) { }
  getLocalToken() {
    return localStorage.getItem('token')
  }

  authenticate(token, password, callback) {
    this._db.list('postmypage').valueChanges().subscribe(res => {
      // Coi chung sai cho nay
      let usersJson = JSON.parse(JSON.stringify(res[1]))
      let positionTokenInArray = Object.keys(usersJson).indexOf(token)
      if (positionTokenInArray == -1) {
        callback('Nhập sai key', false)
        console.log('Nhập sai key')
      } else {
        localStorage.setItem('token', token)
        let existPassword = usersJson[token].password
        if (!existPassword) {

          this._db.list('postmypage/users/').update(token, { password: password })
          console.log('Add User Success')
          callback('Add User Success', true)
        } else {
          console.log('Check password ....')
          existPassword == password ? callback('Login thành công', true) : callback('Sai mật khẩu', false)
        }
      }
    })
  }
}
