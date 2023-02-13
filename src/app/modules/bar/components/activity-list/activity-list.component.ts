import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, PartialObserver } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { Game } from 'src/app/models/game.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { BarService } from 'src/app/services/bar.service';
import { GameService } from 'src/app/services/game.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnInit {

  initColumns: any[] = [
    { name: 'detail', display: 'Detalle', show: true },
    { name: 'active', display: 'Activo', show: true },
    { name: 'name', display: 'Nombre', show: true },
    { name: 'points', display: 'Puntos' , show: false },
    { name: 'type', display: 'Tipo de actividad', show: false },
  ];
  displayedColumns: any[] = this.initColumns.map(col => col.name);

  dataSource!: MatTableDataSource<Game>;

  isSmallScreen$: Observable<boolean> = this.breakpointObserver.observe('(max-width: 960px)')
   .pipe(
     map(result => result.matches),
     shareReplay()
   );

  bar!: Bar;
  games: Game[] = [];

  appPaths = AppPaths;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private barService: BarService,
    private gameService: GameService,
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
        this.getGames(idBar);
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error?.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private async getGames(idBar: number): Promise<void> {
    this.gameService.findAllByBar(idBar)
      .then(({ list }: ResponseList<Game>) => {
        if(list && list.length > 0) {
          this.games = list;
          this.games.forEach((game: Game) => game.type = game.gameType?.name)
          this.dataSource = new MatTableDataSource<Game>(this.games);
        }
      })
      .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error?.message));
  }

  toggleActive(id: number): void {
    this.gameService.updateActive(id)
    .then((game: Game) => {
      const message = game.active ? `Actividad ${game.name} activada exitosamente!` : `Actividad ${game.name} desactivada exitosamente!`;
      this.toastService.openSuccessToast(message);
    })
    .catch(() => this.toastService.openErrorToast('Ocurrió un error al actualizar la actividad'))
  }
}
