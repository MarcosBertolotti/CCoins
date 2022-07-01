import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';

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

  isShowedNavbar: boolean = false;

  constructor(
    private navigationService: NavigationService,
  ) { 
    this.navigationService.navbar$.subscribe((isShowedNavbar) => {
      this.isShowedNavbar = isShowedNavbar;
    })
  }

  ngOnInit(): void { }

}
