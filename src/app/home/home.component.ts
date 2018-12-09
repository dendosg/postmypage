import { Component, OnInit } from "@angular/core";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireStorage } from "angularfire2/storage";
import { Observable } from "rxjs/Observable";
import { PostcontentService } from "../service/postcontent.service";
import { DashboardService } from "../service/dashboard.service";

import { LoadingService } from "@swimlane/ngx-ui";
import { NotificationService } from "@swimlane/ngx-ui";
import { TimeService } from "../service/time.service";

const localToken = localStorage.getItem("token");

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
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
  constructor(
    private _db: AngularFireDatabase,
    public _storage: AngularFireStorage,
    private _postcontentservice: PostcontentService,
    private _dashboardservice: DashboardService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    public timeService: TimeService
  ) {}

  ngOnInit() {
    this._db
      .list("postmypage/users/" + localToken + "/pages")
      .valueChanges()
      .subscribe(arrPages => {
        this.arrPages = arrPages.map(page => ({
          ...page,
          isSelected: false,
          timePublish: ""
        }));
      });
  }
  setTimePublish(page, time) {
    const timePublish = new Date(time).getTime() / 1000;
    page.timeFormat = time;
    return (page.timePublish = timePublish);
  }
  dateChanged(e) {}
  selectAllPage() {
    this.arrPages.map(page => {
      page.isSelected = !this.allSelected;
    });
  }
  // async upload(image) {
  //   const random = Math.floor(Math.random() * 100000);
  //   const res = await this._storage.upload(
  //     "postmypage/" + new Date().getTime() + random,
  //     image
  //   );
  //   const { fullPath } = res.metadata;
  //   const xxxxx = await this._db
  //     .list("postmypage/imageuploaded")
  //     .push(fullPath);
  //   this.arrImageOnStorage.push({
  //     key: xxxxx.key,
  //     path: fullPath
  //   });
  //   this.arrImages.push(res.downloadURL);
  // }
  // uploadImages(images) {
  //   for (let image of images) {
  //     this.upload(image);
  //   }
  // }

  uploadFile = file => {
    if (!file) return Promise.resolve(null);
    const formData = new FormData();
    formData.append("file", file);

    return this._postcontentservice
      .uploadXHR(formData)
      .map(res => res.url)
      .toPromise()
      .catch(error => Promise.resolve(null));
  };

  public onFileChange(files) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.uploadFile(file).then(imgUrl => this.arrImages.push(imgUrl));
    }
  }

  // onFileSelected(event) {
  //   this.attached_media = [];
  //   const { files } = event.target;
  //   if (!files.length) return;
  //   const isTypeVideo = files[0].type.includes("video");
  //   if (isTypeVideo) {
  //     this.isVideo = true;
  //     this.arrImages = [];
  //     console.log("video");
  //   } else {
  //     this.isVideo = false;
  //     // this.arrImages = []
  //   }
  //   this.uploadImages(files);
  // }

  alert(body) {
    this.notificationService.create({
      body,
      styleType: "success",
      timeout: 4000,
      rateLimit: false
    });
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
    // Loc cac anh trong database uploaded
    // for (let item_delete of this.arrImageOnStorage) {
    //   this._db.list("postmypage/imageuploaded").remove(item_delete.key);
    //   this._storage.ref(item_delete.path).delete();
    // }
  }
  renderResult(result,page,form){
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
        return this._postcontentservice
          .postVideo(this.arrDayTime[access_token], contentVideo, access_token)
          .subscribe(res => {
            this.renderResult(res,page,form)
          });
      }
      // post image
      if (this.arrImages.length) {
        return this._postcontentservice
          .postImages(timePublish, content, this.arrImages, access_token)
          .then(res =>
            res.subscribe(postImageUploaded => {
              this.renderResult(postImageUploaded,page,form)
            })
          );
      }
      // post status
      this._postcontentservice
        .postStatus(timePublish, content, access_token)
        .subscribe(res => {
          this.renderResult(res,page,form)
        });
    });
  }
}
