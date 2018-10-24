import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css']
})
export class TimepickerComponent implements OnInit {
  @Input() name: string;
  @Input() id: string;

  // today = new Date()
  // year = this.today.getFullYear()
  // month = this.today.getMonth().toString()
  // day = this.today.getDate().toString()
  date = '';
  time = '';
  constructor() { }

  ngOnInit() {

  }
  clickOK() {
    if (!this.time) {
      this.date = ''
      this.time = ''
      alert('Nhập đúng định dạng thời gian, ví dụ 01/04/2018, 20:00 CH')
     
    }
  }

}
