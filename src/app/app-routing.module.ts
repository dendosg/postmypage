import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages/pages.component';
import { DetailpageComponent } from './dashboard/detailpage/detailpage.component';
import { LoginComponent } from './login/login.component';
import { GuideComponent } from './guide/guide.component';
import { NewcommentComponent } from './newcomment/newcomment.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'pages', component: PagesComponent },
  { path: 'detail/:uid', component: DetailpageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'guide', component: GuideComponent },
  // { path: 'newcomment', component: NewcommentComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
