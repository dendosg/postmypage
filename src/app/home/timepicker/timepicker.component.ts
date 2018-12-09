import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";
import { TimeService } from "../../service/time.service";

@Component({
  selector: "app-timepicker",
  templateUrl: "./timepicker.component.html",
  styleUrls: ["./timepicker.component.css"]
})
export class TimepickerComponent implements OnInit {
  @Input() name: string;
  @Input() id: string;
  @Output() handleValue = new EventEmitter<any>();
  selectedTime;
  constructor(public timeService: TimeService) {}
  ngOnInit() {}
  clickOK() {
    this.handleValue.emit(this.selectedTime);
  }
  reset() {
    this.selectedTime = null;
  }
}
