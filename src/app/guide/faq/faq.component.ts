import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  @Input() question: string;
  @Input() img: string;
  @Input() answer:string;
  id: string;
  href: string;
  constructor() { }

  ngOnInit() {
    this.id = Math.random().toString()
    this.href = '#' + this.id
  }

}
