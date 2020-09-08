import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireStorage } from "angularfire2/storage";
import { Observable } from "rxjs/Observable";
import { PostcontentService } from "../service/postcontent.service";
import { DashboardService } from "../service/dashboard.service";
import { get, filter } from 'lodash';
import {
  LoadingService,
  NotificationService,
  AlertService
} from "@swimlane/ngx-ui";
import { TimeService } from "../service/time.service";
import { BaseComponent } from "../base.component";
import { tap } from "rxjs/operators";
declare var $: any;

const localToken = localStorage.getItem("token");

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent extends BaseComponent implements OnInit {
  allSelected;
  content;
  arrPages = [];
  choosePage = false;
  showProgress = false;
  public filterKeyword: string;
  arrDayTime = [];
  arrImages = [];
  arrPosted = [];
  scheduled_publish_time: number;
  isVideo = false;
  attached_media;
  percentUploadImage: number;
  arrImageOnStorage = [];
  public filesResult = [];
  constructor(
    private _db: AngularFireDatabase,
    public _storage: AngularFireStorage,
    private _postcontentservice: PostcontentService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    public timeService: TimeService,
    public alertService: AlertService
  ) {
    super();
  }

  ngOnInit() {
    this.loadingService.start()
    this._subscription.add(
      this._db
      .list("postmypage/users/" + localToken + "/pages")
      .valueChanges()
      .subscribe(arrPages => {
        this.loadingService.complete()
        if (!arrPages) return;
        this.arrPages = arrPages.map(page => ({
          ...page,
          isSelected: false,
          timePublish: ""
        }));
      })
    );
  }

  public get selectedPages() {
    return filter(this.arrPages, 'isSelected');
  }
  // ngAfterViewChecked() {
  //   $(function () {
  //     $('[data-toggle="tooltip"]').tooltip()
  //   })
  // }

  setTimePublish(page, time) {
    const timePublish = new Date(time).getTime() / 1000;
    page.timeFormat = time;
    return (page.timePublish = timePublish);
  }
  setTimePublishAllPage(time) {
    const timePublish = new Date(time).getTime() / 1000;
    this.arrPages = this.arrPages.map(page => ({
      ...page,
      timePublish,
      timeFormat: time
    }))
  }
  selectAllPage() {
    this.arrPages = this.arrPages.map(page =>({
      ...page,
      isSelected: !this.allSelected
    }))
  }

  public uploadFile = async (file) => {
    if (!file) return Promise.resolve(null);
    const formData = new FormData();
    formData.append("source", file);
    formData.append('type', 'file');
    formData.append('action', 'upload');
    formData.append('expiration', 'PT5M');
    let type = "image";
    if (file.type.includes("video")) {
      this.showProgress = true
      this.isVideo = true;
      type = "video";
    }
    return fetch('https://vi.imgbb.com/json', {
      body: formData,
      method: 'post'
    }).then(res => res.json()).then(res => {
      const permalink = get(res, 'image.image.url')
      return permalink;
    })
    .catch(() => Promise.resolve(null))
  }

  public uploadFileV2 = async (file) => {
    if (!file) return Promise.resolve(null);
    const formData = new FormData();
    formData.append("file", file);
    let type = "image";
    if (file.type.includes("video")) {
      this.showProgress = true
      this.isVideo = true;
      type = "video";
    }
    return fetch(`https://api.polymate.fr/v1/files/${type}`, {
      body: formData,
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiJkeXVQVXlmWUNZIiwicmVmcmVzaFRva2VuSWQiOiJHbTBFYW8xeVo3IiwidHlwZSI6IkFDQ0VTU19UT0tFTiIsImlhdCI6MTU5OTU1NTA5OSwiZXhwIjoxNjAyMTQ3MDk5fQ.PaRFha56GrhxQUK2VA67V3f6Ejf2yzxhke-cf-kCzuE',
      },
      method: 'post'
    }).then(res => res.json()).then(res => {
      const permalink = get(res, 'url')
      return permalink;
    })
    .catch(() => Promise.resolve(null))
  }

  public selectPage(page) {
    this.arrPages = this.arrPages.map(item => {
      if(item.id !== page.id) return item;
      return {
        ...item,
        isSelected: !item.isSelected
      }
    })
  }
  // uploadFile2 = async  file => {
    // if (!file) return Promise.resolve(null);
    // const formData = new FormData();
    // formData.append("file", file);
    // formData.append('thread_id', '1896028');
    // let type = "image";
    // if (file.type.includes("video")) {
    //   this.showProgress = true
    //   this.isVideo = true;
    //   type = "video";
    // }
    // return fetch('https://tinhte.vn/appforo/index.php?posts/attachments&oauth_token=acc0c2e14257a0974a323db52796fa948eff86aa', {
    //   body: formData,
    //   method: 'post'
    // }).then(res => res.json()).then(res => {
    //   const permalink = get(res, 'attachment.links.permalink')
    //   return permalink;
    // })
    // .catch(() => Promise.resolve(null))
    // return this._postcontentservice
    //   .uploadXHR(formData, type)
    //   .map(res => res.url)
    //   .toPromise()
    //   .catch(error => Promise.resolve(null));
  // };

  public async onFileChange(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadFileV2(file).then(imgUrl => {
        if (this.isVideo) this.showProgress = false;
        this.arrImages.push(imgUrl)});
    }
  }


  alert(message) {
    this.alertService.alert({ title: "Fail", content: message });
  }
  removeImage(img) {
    const index = this.arrImages.indexOf(img);
    this.arrImages.splice(index, 1);
  }
  resetForm(form) {
    form.reset();
    this.arrImages = [];
    this.arrDayTime = [];
    this.isVideo = false;
    this.arrImageOnStorage = [];
  }
  
  renderResult(result, page, form) {
    const postedId = result.json().id;
    this.arrPosted.push({
      post_id: postedId,
      page_id: page.id,
      page_name: page.name
    });
    return this.notificationService.create({
      body: page.timePublish ? 'Lên lịch thành công!' : 'Đăng bài thành công!',
      title: page.name,
      styleType: 'success'
    })
    // this.loadingService.complete();
    // this.resetForm(form);
  }
  public postToPage(page, form, content): Promise<any> {
    const formvalue = form.value;
    const { access_token, timePublish } = page;
      const distance = this.timeService.getDistance(
        new Date().getTime(),
        timePublish * 1000
      );
      if (timePublish && distance < 1) {
        this.loadingService.complete();
         this.alert(
          "Thời gian lên lịch sớm nhất là trước 1 tiếng. Vui lòng chọn lại thời gian đăng bài!"
        );
        return null
      }

      // post video
      if (this.isVideo) {
        const contentVideo = {
          video: this.arrImages[0],
          title: formvalue.titleVideo,
          description: content
        };
          return this._postcontentservice
          .postVideo(this.arrDayTime[access_token], contentVideo, access_token)
          .pipe(tap(res => {
            this.renderResult(res, page, form);
          }))
          .toPromise()
          // .subscribe(res => {
          //   this.renderResult(res, page, form);
          // })
      }
      // post image
      if (this.arrImages.length) {
        return this._postcontentservice
          .postImages(timePublish, content, this.arrImages, access_token)
          .then(res => res.pipe(tap(res => this.renderResult(res, page, form))).toPromise());
      }
      // post status
      return this._postcontentservice
        .postStatus(timePublish, content, access_token)
        .pipe(tap(res => this.renderResult(res, page, form)))
        .toPromise()
  }
  async onFormSubmit(form) {
    const formvalue = form.value;
    const selectedPages = this.arrPages.filter(page => page.isSelected);
    if (!selectedPages.length) return this.alert("Chọn page muốn đăng!");

    const { content } = formvalue;
    if (!content && !this.arrImages.length) return;
    this.loadingService.start();

    for(const page of selectedPages) {
      await this.postToPage(page, form, content)
    }
    this.loadingService.complete();
    this.resetForm(form);
  }
}
