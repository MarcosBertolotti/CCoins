import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { GameTypes } from 'src/app/enums/game-types.enum';
import { Bar } from 'src/app/models/bar-model';
import { GameType } from 'src/app/models/game-type.model';
import { Game } from 'src/app/models/game.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { BarService } from 'src/app/services/bar.service';
import { GameService } from 'src/app/services/game.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.scss']
})
export class ActivityCreateComponent implements OnInit {

  bar!: Bar;
  gameTypes: GameType[] = [];
  formGroup!: FormGroup;
  
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
    if(!idBar) this.goToHome();

    this.getCurrentBar(idBar);
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  buildForm() {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      points: ['', [Validators.required]],
      rules: [''],
      openTime: [''],
      closeTime: [''],
      gameType: [this.gameTypes, [Validators.required]],
    });

    this.gameType.valueChanges.subscribe((value: GameType) => {
      if(value?.name === GameTypes.CODE) {
        this.points.reset();
        this.points.clearValidators();
        this.points.disable();
      } else {
        this.points.enable();
        this.points.addValidators(Validators.required);
      }
      console.log(value);
    })
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
        this.gameTypes = list
      this.buildForm();
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message))
  }

  submitForm(): void {
    if (this.formGroup.valid) {
      const newGame: Game = {
        name: this.name.value.trim(),
        rules: this.rules.value.trim(),
        points: this.points.value,
        gameType: this.gameType.value,
        openTime: this.openTime.value,
        closeTime: this.closeTime.value,
        bar: this.bar.id,
        active: true,
      }

      this.gameService.saveOrUpdate(newGame)
      .then(() => {
        this.toastService.openSuccessToast('Actividad creada exitosamente!');
        this.router.navigate([AppPaths.ADMIN, AppPaths.BAR, this.bar.id, AppPaths.ACTIVITIES]);
      })
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
    }
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
