import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() drawer!: MatDrawer;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  me!: ClientTableDTO;
  nickName$!: Observable<string>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private clientService: ClientService,
  ) { }

  ngOnInit(): void {
    this.nickName$ = this.clientService.nickName$;
  }

}
