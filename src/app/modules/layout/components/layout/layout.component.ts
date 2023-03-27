import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  /**
   * Indicates if the device is a handset
   **/
  isHandset!: boolean;

  /**
   * Indicates if the device is a handset
   **/
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    tap(isHandset => this.isHandset = isHandset),
    shareReplay()
  );
 
  /**
   * Sidenav componenet ref
   **/
  @ViewChild(SidenavComponent)
  sidenavComponent!: SidenavComponent;
  
  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
  ) { }
  
  closeDrawer(): void {
    if(this.isHandset)
      this.sidenavComponent?.drawer?.close();
  }
   
  ngOnInit(): void {
    this.cdr.detectChanges(); // TODO
  }

}
