import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, PartialObserver } from 'rxjs';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { GameType } from 'src/app/models/game-type.model';
import { Game } from 'src/app/models/game.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { BarService } from 'src/app/services/bar.service';
import { GameService } from 'src/app/services/game.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit {

  bar!: Bar;
  idGame!: number;
  game!: Game;
  formGroup!: FormGroup;
  gameTypes!: GameType[];
  //gameTypes: Observable<any[]> = of();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private barService: BarService,
    private gameService: GameService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    const idBar = +this.route.snapshot.paramMap.get('id')!;
    this.idGame = +this.route.snapshot.paramMap.get('idGame')!;

    if(!idBar || !this.idGame) this.goToHome();

    this.getCurrentBar(idBar);
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      name: [this.game.name, [Validators.required]],
      points: [this.game.points, [Validators.required]],
      rules: [this.game.rules],
      gameType: [this.game.gameType, [Validators.required]],
      openTime: [this.game.openTime],
      closeTime: [this.game.closeTime],
    });
  }

  private getCurrentBar(idBar: number): void {
    const barObserver: PartialObserver<Bar> = {
      next: async (bar: Bar) => {
        this.bar = bar;
        this.getGameTypes();
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error?.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private getGameTypes(): void {
    this.gameService.findAllTypes()
    .then(({ list }: ResponseList<GameType>) => {
      if(list?.length > 0)
        this.gameTypes = list;
      this.getGame();
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  private getGame(): void {
    this.gameService.findById(this.idGame)
    .then((game: Game) => {
      if(game)
        this.game = game;
      this.buildForm();
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  submitForm(): void {
    if (this.formGroup.valid) {
      const updatedGame: Game = {
        id: this.game.id,
        name: this.name.value.trim(),
        rules: this.rules.value.trim(),
        points: this.points.value,
        gameType: this.gameType.value,
        openTime: this.openTime.value,
        closeTime: this.closeTime.value,
        bar: this.bar.id,
        active: this.game.active,
      }

      this.gameService.saveOrUpdate(updatedGame)
      .then((game: Game) => this.toastService.openSuccessToast('Actividad actualizada exitosamente!'))
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
    }
  }

  toggleActive(): void {
    this.gameService.updateActive(this.game.id!)
      .then((game: Game) => {
        this.game.active = game.active;
        const status = this.game.active ? 'activado' : 'desactivado';
        this.toastService.openSuccessToast(`Actividad ${this.game.name} ${status} exitosamente!`);
      })
      .catch(() => this.toastService.openErrorToast('Ocurrió un error al actualizar el juego'))
  }

  displayItemFn(item?: any): string {
    return item?.name ? item.name : "";
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get rules() { return this.formGroup.get('rules') as FormControl }
  get points() { return this.formGroup.get('points') as FormControl }
  get gameType() { return this.formGroup.get('gameType') as FormControl }
  get openTime() { return this.formGroup.get('openTime') as FormControl }
  get closeTime() { return this.formGroup.get('closeTime') as FormControl }

}
