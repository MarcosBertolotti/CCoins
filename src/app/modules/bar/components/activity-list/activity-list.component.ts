import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
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

  bar!: Bar;
  games: Game[] = [];

  appPaths = AppPaths;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private barService: BarService,
    private gameService: GameService,
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
        this.toastService.openErrorToast(error.error.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private async getGames(idBar: number): Promise<void> {
    this.gameService.findAllByBar(idBar)
      .then(({ list }: ResponseList<Game>) => {
        if(list && list.length > 0)
          this.games = list;
          //this.updateMatTable();
          // this.buildForm();
      })
      .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error.message));
  }
}
