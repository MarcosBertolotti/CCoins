import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() drawer!: MatDrawer;

  @Input() isHandset$!: Observable<boolean>;

  @Input() logoName: string = 'chopp_coins_cinta';

  @Input() logoFormat: string = 'png';

  constructor() { }

  ngOnInit(): void {
  }

}
