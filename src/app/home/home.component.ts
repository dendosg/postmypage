import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireStorage } from "angularfire2/storage";
import { Observable } from "rxjs/Observable";
import { PostcontentService } from "../service/postcontent.service";
import { DashboardService } from "../service/dashboard.service";
import {get} from 'lodash';
import {
  LoadingService,
  NotificationService,
  AlertService
} from "@swimlane/ngx-ui";
import { TimeService } from "../service/time.service";
import { BaseComponent } from "../base.component";

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
    public timeService: TimeService,
    public alertService: AlertService
  ) {
    super();
  }

  ngOnInit() {
    this._subscription.add(
      this._db
      .list("postmypage/users/" + localToken + "/pages")
      .valueChanges()
      .subscribe(arrPages => {
        this.arrPages = arrPages.map(page => ({
          ...page,
          isSelected: false,
          timePublish: ""
        }));
      })
    );
  }
  setTimePublish(page, time) {
    const timePublish = new Date(time).getTime() / 1000;
    page.timeFormat = time;
    return (page.timePublish = timePublish);
  }
  setTimePublishAllPage(time) {
    const timePublish = new Date(time).getTime() / 1000;
    this.arrPages.map(page => {
      page.timePublish = timePublish;
      page.timeFormat = time;
    });
  }
  dateChanged(e) {}
  selectAllPage() {
    this.arrPages.map(page => {
      page.isSelected = !this.allSelected;
    });
  }


  uploadFile = async  file => {
    if (!file) return Promise.resolve(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append('thread_id', '1896028');
    let type = "image";
    if (file.type.includes("video")) {
      this.showProgress = true
      this.isVideo = true;
      type = "video";
    }
    return fetch('https://tinhte.vn/appforo/index.php?posts/attachments&oauth_token=acc0c2e14257a0974a323db52796fa948eff86aa', {
      body: formData,
      method: 'post'
    }).then(res => res.json()).then(res => {
      const permalink = get(res, 'attachment.links.permalink')
      return permalink;
    })
    .catch(() => Promise.resolve(null))
    // return this._postcontentservice
    //   .uploadXHR(formData, type)
    //   .map(res => res.url)
    //   .toPromise()
    //   .catch(error => Promise.resolve(null));
  };

  public async onFileChange(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadFile(file).then(imgUrl => {
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
    this.loadingService.complete();
    this.resetForm(form);
  }
  onFormSubmit(form) {
    const formvalue = form.value;
    const selectedPages = this.arrPages.filter(page => page.isSelected);
    if (!selectedPages.length) return this.alert("Chọn page muốn đăng!");

    const { content } = formvalue;
    if (!content && !this.arrImages.length) return;
    this.loadingService.start();

    selectedPages.forEach(page => {
      const { access_token, timePublish } = page;
      const distance = this.timeService.getDistance(
        new Date().getTime(),
        timePublish * 1000
      );
      if (timePublish && distance < 1) {
        this.loadingService.complete();
        return this.alert(
          "Thời gian lên lịch sớm nhất là trước 1 tiếng. Vui lòng chọn lại thời gian đăng bài!"
        );
      }

      // post video
      if (this.isVideo) {
        const contentVideo = {
          video: this.arrImages[0],
          title: formvalue.titleVideo,
          description: content
        };
        return this._subscription.add(
          this._postcontentservice
          .postVideo(this.arrDayTime[access_token], contentVideo, access_token)
          .subscribe(res => {
            this.renderResult(res, page, form);
          })
        );
      }
      // post image
      if (this.arrImages.length) {
        return this._postcontentservice
          .postImages(timePublish, content, this.arrImages, access_token)
          .then(res =>
            this._subscription.add(
              res.subscribe(postImageUploaded => {
                this.renderResult(postImageUploaded, page, form);
              })
            )
          );
      }
      // post status
      this._subscription.add(
        this._postcontentservice
        .postStatus(timePublish, content, access_token)
        .subscribe(res => {
          this.renderResult(res, page, form);
        })
      );
    });
  }
}
