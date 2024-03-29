import { Component, Input, OnInit } from '@angular/core';
import { AppPaths } from 'src/app/enums/app-paths.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input()
  items: any[] = [];

  @Input()
  sectionPath!: string;

  @Input()
  id?: number;

  barPath = `/${AppPaths.ADMIN}/${AppPaths.BAR}`;

  barItems!: any[];

  constructor() { 
  }

  ngOnInit(): void {
    this.buildPaths();
  }

  ngOnChanges() {
    this.buildPaths();
  }

  buildPaths(): void {
    this.barItems = [
      {
        name: "Detalle",
        path: `${this.barPath}/${AppPaths.UPDATE}/${this.id}`,
        display: this.id, //this.display(AppPaths.UPDATE),
      },
      /*{
        name: 'Crear',
        path: `${this.barPath}/${AppPaths.CREATE}`,
        display: true,
      },*/
      {
        name: 'Listar',
        path: `${this.barPath}/${AppPaths.LIST}`,
        display: true,
      },
    ];

    if(this.sectionPath === AppPaths.BAR)
      this.items = this.barItems;
  }

  display(path: string): boolean {
    return window.location.pathname.includes(path);
  }

}
