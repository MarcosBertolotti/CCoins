import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, PartialObserver } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { Prize } from 'src/app/models/prize.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { BarService } from 'src/app/services/bar.service';
import { PrizeService } from 'src/app/services/prize.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-prize-list',
  templateUrl: './prize-list.component.html',
  styleUrls: ['./prize-list.component.scss']
})
export class PrizeListComponent implements OnInit {

  initColumns: any[] = [
    { name: 'detail', display: 'Detalle', show: true },
    { name: 'active', display: 'Activo', show: true },
    { name: 'name', display: 'Nombre', show: true },
    { name: 'points', display: 'Puntos' , show: false },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<Prize>;

  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
   .pipe(
     map(result => result.matches),
     shareReplay()
   );

  bar!: Bar;
  prizes: Prize[] = [];

  appPaths = AppPaths;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private barService: BarService,
    private prizeService: PrizeService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    const idBar = +this.route.snapshot.paramMap.get('id')!;
    if(!idBar) this.goToHome();

    this.getCurrentBar(idBar);
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  private getCurrentBar(idBar: number): void {
    const barObserver: PartialObserver<Bar> = {
      next: async (bar: Bar) => {
        this.bar = bar;
        this.getPrizes(idBar);
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error?.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private async getPrizes(idBar: number): Promise<void> {
    this.prizeService.findAllByBar(idBar)
      .then(({ list }: ResponseList<Prize>) => {
        if(list && list.length > 0) {
          this.prizes = list;
          this.dataSource = new MatTableDataSource<Prize>(this.prizes);
        }
      })
      .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error?.message));
  }

  toggleActive(id: number): void {
    this.prizeService.updateActive(id)
    .then((prize: Prize) => {
      const message = prize.active ? `Premio ${prize.name} activado exitosamente!` : `Premio ${prize.name} desactivado exitosamente!`;
      this.toastService.openSuccessToast(message);
    })
    .catch(() => this.toastService.openErrorToast('Ocurrió un error al actualizar el premio'))
  }

}
