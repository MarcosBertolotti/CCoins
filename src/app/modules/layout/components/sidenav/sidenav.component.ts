import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

  @ViewChild('drawer')
  drawer!: MatDrawer;

  @Input() isHandset$!: Observable<boolean>;

  @Output()
  onClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void { }

}
