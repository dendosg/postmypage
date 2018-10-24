import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {
  date = '';
  time = '';
  constructor() { }

  ngOnInit() {
  }
  clickOK() {
    if (!this.time) {
      alert('Nhập đúng định dạng thời gian, ví dụ 01/04/2018, 20:00 CH')
    }
  }

}
