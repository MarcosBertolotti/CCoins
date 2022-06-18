import { Component, OnInit } from '@angular/core';
import { AppPaths } from 'src/app/enums/app-paths.enum';

@Component({
  selector: 'app-bar-list',
  templateUrl: './bar-list.component.html',
  styleUrls: ['./bar-list.component.scss']
})
export class BarListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  appPaths = AppPaths;
}
