import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss']
})
export class SlideToggleComponent implements OnInit {

  @Output()
  toggle = new EventEmitter<any>();
  
  @Input()
  title!: string;
  
  @Input()
  name!: string;
  
  @Input()
  value!: boolean;
  
  constructor() { }

  ngOnInit(): void {
  }

}
