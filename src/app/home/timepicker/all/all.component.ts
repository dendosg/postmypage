import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { TimeService } from "../../../service/time.service";

@Component({
  selector: "app-all",
  templateUrl: "./all.component.html",
  styleUrls: ["./all.component.css"]
})
export class AllComponent implements OnInit {
  @Output() handleValue = new EventEmitter();
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
