import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  @Input()
  name: string = 'chopp_coins';

  @Input()
  format: string = 'png';

  constructor() {
  }

  ngOnInit(): void {
    this.name = `assets/${this.name}.${this.format}`;
  }

}
