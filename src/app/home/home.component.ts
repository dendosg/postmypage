import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { PostcontentService } from '../service/postcontent.service';
import { DashboardService } from '../service/dashboard.service';

import { LoadingService } from '@swimlane/ngx-ui';
import { NotificationService } from '@swimlane/ngx-ui';
const localToken = localStorage.getItem('token')

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  chooseAll;
  toggleChk;
  content;
  arrPages: Observable<any[]>
  choosePage = false;
  showProgress = false;
  arrDayTime = [];
  arrImages = [];
  arrPosted = [];
  scheduled_publish_time: number;
  isVideo = false;
  attached_media;
  percentUploadImage: number;
  arrImageOnStorage = []
  constructor(
    private _db: AngularFireDatabase,
    public _storage: AngularFireStorage,
    private _http: Http,
    private _postcontentservice: PostcontentService,
    private _dashboardservice: DashboardService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.arrPages = this._db.list('postmypage/users/' + localToken + '/pages').valueChanges()
  }
  async  upload(image) {
    let random = Math.floor(Math.random() * 100000)
    let res = await this._storage.upload('postmypage/' + new Date().getTime() + random, image)
    let { fullPath } = res.metadata
    let xxxxx = await this._db.list('postmypage/imageuploaded').push(fullPath)
    this.arrImageOnStorage.push({
      key: xxxxx.key,
      path: fullPath
    })
    this.arrImages.push(res.downloadURL)
  }
  uploadImages(images) {
    for (let image of images) {
      this.upload(image)
    }
  }
  onFileSelected(event) {
    this.attached_media = [];
    let images = event.target.files
    if (images.length) {
      let isTypeVideo = images[0].type.indexOf('video') == 0
      if (isTypeVideo) {
        this.isVideo = true;
        this.arrImages = [];
        console.log('video')
      } else {
        this.isVideo = false
        // this.arrImages = []
      }
    } else {
      console.log('Không có file được chọn')
    }
    this.uploadImages(images)
  }

  alert(body) {
    this.notificationService.create({
      body: body,
      styleType: 'success',
      timeout: 4000,
      rateLimit: false
    })
  }
  removeImage(img) {
    let position = this.arrImages.indexOf(img)
    this.arrImages.splice(position, 1);
  }
  resetForm(form) {
    form.reset()
    this.arrImages = []
    this.arrDayTime = []
    this.isVideo = false;
    // Loc cac anh trong database uploaded 
    for (let item_delete of this.arrImageOnStorage) {
      this._db.list('postmypage/imageuploaded').remove(item_delete.key)
      this._storage.ref(item_delete.path).delete()
    }
    this.arrImageOnStorage = []
  }
  onFormSubmit(form) {
    // Start datetime
    let formvalue = form.value
    if (formvalue['pickerAll'] != '|') {
      console.log('all')
      let timeAll = this._postcontentservice.getTime(form.value['pickerAll'])
      this.scheduled_publish_time = timeAll
    } else {
      Object.keys(formvalue).map(key => {
        let dash = 'datetimepicker-'
        let positionDash = key.indexOf('datetimepicker')
        if (positionDash != -1 && formvalue[key] != '|') {

          var acc = key.slice(positionDash + dash.length)
          var huy = this._postcontentservice.getTime(form.value[key])
          this.arrDayTime[acc] = (huy)
        }
      })
    }
    // End datetime


    let isPageSelected = Object.values(form.value).indexOf(true)
    if (isPageSelected == -1) {
      console.log('Chưa chọn page')
      this.choosePage = true;
      this.alert('Chọn page muốn đăng')
    } else {
      let formvalue = form.value
      let content = formvalue.content
      if (content || this.arrImages) {
        this.loadingService.start()
        if (this.arrImages.length) {
          Object.keys(form.value).map(access_token => {
            if (formvalue[access_token] === true && access_token != 'chooseAll') {
              if (this.isVideo) {
                let contentVideo = {
                  video: this.arrImages[0],
                  title: formvalue.titleVideo,
                  description: content
                }
                this._postcontentservice.postVideo(this.arrDayTime[access_token], contentVideo, access_token, (err, res) => {
                  this._dashboardservice.getInfoPage(access_token, (err, info) => {
                    if (info) {
                      this.arrPosted.push({ post_id: res.id, page_id: info.id, page_name: info.name })
                      this.loadingService.complete()
                      this.resetForm(form)
                    }
                  })
                })
              } else {
                let publish_time;
                this.scheduled_publish_time ? publish_time = this.scheduled_publish_time : publish_time = this.arrDayTime[access_token]
                this._postcontentservice.postImages(publish_time, content, this.arrImages, access_token, (err, res) => {
                  this._dashboardservice.getInfoPage(access_token, (err, info) => {
                    if (info) {
                      this.arrPosted.push({ post_id: res.id, page_id: info.id, page_name: info.name })
                      this.loadingService.complete()
                      this.resetForm(form)
                    }
                  })
                })
              }

            }
          })
        } else {
          console.log('Post Text')
          Object.keys(formvalue).map(access_token => {
            if (formvalue[access_token] === true && access_token != 'chooseAll') {
              let publish_time;
              this.scheduled_publish_time ? publish_time = this.scheduled_publish_time : publish_time = this.arrDayTime[access_token]

              this._postcontentservice.postStatus(publish_time, content, access_token, (err, res) => {
                if (err) {
                  this.alert('Fail')
                  this.loadingService.complete()
                } else {
                  this._dashboardservice.getInfoPage(access_token, (err, info) => {
                    if (info) {
                      this.arrPosted.push({ post_id: res.id, page_id: info.id, page_name: info.name })
                      this.loadingService.complete()
                      this.resetForm(form)
                    }
                  })
                }
              })
            }
          })
        }
      }
    }
  }
}