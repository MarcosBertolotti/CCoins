import { Component, OnInit } from '@angular/core';
import { AppPaths } from 'src/app/enums/app-paths.enum';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  items = [
    {
      route: AppPaths.BAR,
      title: 'Home',
    },
    {
      route: '#',
      title: 'Section 2',
    },
    {
      route: '#',
      title: 'Section 3',
    },
    {
      route: '#',
      title: 'Section 4',
    },
  ];

  paths = AppPaths;

  constructor() { }

  ngOnInit() {
  }

}
