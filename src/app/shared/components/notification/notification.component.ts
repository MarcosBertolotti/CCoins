import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input()
  count = 0;

  @Input()
  action!: () => void;

  constructor() { }

  ngOnInit(): void {
  }

  execute(): void {
    if(this.action)
      this.action();   
  }

}
