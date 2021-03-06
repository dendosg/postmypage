import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable()
export class TimeService {
  getDateFormat(date, type) {
    return moment(date).format(type);
  }
  getDistance(time1, time2) {
    return moment(time2).diff(moment(time1), "hours");
  }
}
