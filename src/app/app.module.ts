import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { AppRoutingModule } from "./app-routing.module";
import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";
// Ngx ui
import { NgxUIModule } from "@swimlane/ngx-ui";
// Angularfire2
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireStorageModule } from "angularfire2/storage";

import { NavbarComponent } from "./navbar/navbar.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { HomeComponent } from "./home/home.component";
import { PagesComponent } from "./pages/pages.component";
// Service
import { PagesService } from "./service/pages.service";
import { DashboardService } from "./service/dashboard.service";
import { PostcontentService } from "./service/postcontent.service";
import { DetailpageComponent } from "./dashboard/detailpage/detailpage.component";
import { DetailpageService } from "./service/detailpage.service";
import { NewcommentService } from "./service/newcomment.service";
import { LoginService } from "./service/login.service";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { GuideComponent } from "./guide/guide.component";
import { FaqComponent } from "./guide/faq/faq.component";

import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { TimepickerComponent } from "./home/timepicker/timepicker.component";
import { AllComponent } from "./home/timepicker/all/all.component";
import { NewcommentComponent } from "./newcomment/newcomment.component";
// Ngx Pagination
import { NgxPaginationModule } from "ngx-pagination";
import { RepcmtComponent } from "./newcomment/repcmt/repcmt.component";
import { SubcmtComponent } from "./newcomment/repcmt/subcmt/subcmt.component";
import { LoadingimgComponent } from "./home/loadingimg/loadingimg.component";
// Image2Imgur
import { Ng2ImgurUploaderModule } from "ng2-imgur-uploader";
import { DlDateTimePickerDateModule } from "angular-bootstrap-datetimepicker";
import { TimeService } from "./service/time.service";
import { MyFilterPipe } from "./home/filter.pipe";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    HomeComponent,
    PagesComponent,
    DetailpageComponent,
    LoginComponent,
    GuideComponent,
    FaqComponent,
    TimepickerComponent,
    AllComponent,
    NewcommentComponent,
    RepcmtComponent,
    SubcmtComponent,
    LoadingimgComponent,
    MyFilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxUIModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    Ng2ImgurUploaderModule,
    DlDateTimePickerDateModule
  ],
  providers: [
    PagesService,
    DashboardService,
    PostcontentService,
    DetailpageService,
    LoginService,
    NewcommentService,
    TimeService,
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
