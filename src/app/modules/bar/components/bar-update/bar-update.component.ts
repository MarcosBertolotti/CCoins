import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { FIELD_ERROR_MESSAGES } from 'src/app/const/field-error-messages.const';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { Game } from 'src/app/models/game.model';
import { Prize } from 'src/app/models/prize.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { Table } from 'src/app/models/table.model';
import { BarService } from 'src/app/services/bar.service';
import { GameService } from 'src/app/services/game.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { PrizeService } from 'src/app/services/prize.service';
import { TableService } from 'src/app/services/table.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-bar-update',
  templateUrl: './bar-update.component.html',
  styleUrls: ['./bar-update.component.scss']
})
export class BarUpdateComponent implements OnInit, OnDestroy {

  bar!: Bar;
  idBar!: number;
  barTables: Table[] = [];
  tableQuantity: number = 0;
  formGroup!: FormGroup;

  games: Game[] = [];
  prizes: Prize[] = [];

  fieldErrors = FIELD_ERROR_MESSAGES;
  appPaths = AppPaths;
  
  constructor(
    private formBuilder: FormBuilder,
    private barService: BarService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TableService,
    private navigationService: NavigationService,
    private gameService: GameService,
    private prizeService: PrizeService,
  ) { 
    this.navigationService.showNavbar();
  }

  ngOnDestroy(): void {
    this.navigationService.hideNavbar();
  }

  async ngOnInit(): Promise<void> {    
    this.idBar = +this.route.snapshot.paramMap.get('id')!;

    this.getBar();
    this.getGames();
    this.getPrizes();
  }

  private getBar(): void {
    const barObserver: PartialObserver<Bar> = {
      next: async (bar: Bar) => {
        const tables: any = await this.tableService.findAllByBar(this.idBar)
          .catch((error: HttpErrorResponse) => console.error(error.error.message));
  
        if(tables && tables.list?.length > 0) {
          this.barTables = tables.list;
          this.tableQuantity = this.barTables.length;
        }
        this.bar = bar;
        this.buildForm();
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(this.idBar).subscribe(barObserver);   
  }

  private getGames(): void {
    this.gameService.findAllByBar(this.idBar)
    .then(({ list }: ResponseList<Game>) => {
      if(list && list.length > 0)
        this.games = list;
    })
    .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error.message));
  }

  private getPrizes(): void {
    this.prizeService.findAllByBar(this.idBar)
    .then(({ list }: ResponseList<Prize>) => {
      if(list && list.length > 0)
        this.prizes = list;
    })
    .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error.message));
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  private buildForm() {
    this.formGroup = this.formBuilder.group({
      name: [this.bar.name, [Validators.required]],
      address: [this.bar.address, [Validators.required]],
      location: [this.bar.location, [Validators.required]],
      menuLink: [this.bar.menuLink],
      tables: [this.barTables.length, [Validators.required, Validators.min(1), Validators.max(20)]],
      openTime: [this.bar.openTime],
      closeTime: [this.bar.closeTime],
    });
  }
  
  async submitForm(): Promise<void> {
    if (this.formGroup.valid) {
      const updateBar: Bar = {
        id: this.bar.id,
        name: this.name.value.trim(),
        address: this.address.value.trim(),
        location: this.location.value.trim(),
        menuLink: this.menuLink.value.trim(),
        active: this.bar.active,
        openTime: this.openTime.value,
        closeTime: this.closeTime.value,
      }

      const barCreated = this.barService.create(updateBar)
        .catch((error: HttpErrorResponse) => {
          //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
          this.toastService.openErrorToast(error.error.message);
        });
      
      let quantityToUpdate = (this.tables.value - this.tableQuantity);
      let tablesUpdated

      if(quantityToUpdate !== 0)
        tablesUpdated = quantityToUpdate > 0 ? this.createTables(quantityToUpdate) : this.removeTables(quantityToUpdate * -1);

      const response = await Promise.all([barCreated, tablesUpdated]);

      if(response[0])
        this.toastService.openSuccessToast('Bar actualizado exitosamente!');
    }
  }

  private createTables(quantity: number): Promise<void | Table[]> {
    return this.tableService.createByQuantity(quantity, this.bar.id!)
    .then(() => this.tableQuantity = this.tables.value)
    .catch((error: HttpErrorResponse) => {
      //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
      this.toastService.openErrorToast(error.error.message);
    });
  }

  private removeTables(quantity: number): Promise<void | Table[]> {
    return this.tableService.removeByQuantity(quantity, this.bar.id!)
    .then(() => this.tableQuantity = this.tables.value)
    .catch((error: HttpErrorResponse) => {
      //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
      this.toastService.openErrorToast(error.error.message);
    });
  }

  async toggleActive(): Promise<void> {
    this.barService.updateActive(this.bar.id!)
    .then((bar: Bar) => {
      this.bar.active = bar.active;
      const status = this.bar.active ? 'activado' : 'desactivado';
      this.toastService.openSuccessToast(`${this.bar.name} ${status} exitosamente!`);
    })
    .catch((error: HttpErrorResponse) => {
      //const message = error.error?.name === ApiErrorResponses.EXISTING_OBJECT ? 'Ya existe un Bar' : error.message;
      this.toastService.openErrorToast(error.error.message);
    });
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get address() { return this.formGroup.get('address') as FormControl }
  get location() { return this.formGroup.get('location') as FormControl }
  get menuLink() { return this.formGroup.get('menuLink') as FormControl }
  get tables() { return this.formGroup.get('tables') as FormControl }
  get openTime() { return this.formGroup.get('openTime') as FormControl }
  get closeTime() { return this.formGroup.get('closeTime') as FormControl }

}
