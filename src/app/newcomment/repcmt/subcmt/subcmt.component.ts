import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subcmt',
  templateUrl: './subcmt.component.html',
  styleUrls: ['./subcmt.component.css']
})
export class SubcmtComponent implements OnInit {
  @Input() subcmt: any
  constructor() { }

  ngOnInit() {
  }

}
