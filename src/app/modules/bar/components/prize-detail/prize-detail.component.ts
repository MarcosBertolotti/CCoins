import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { Bar } from 'src/app/models/bar-model';
import { Prize } from 'src/app/models/prize.model';
import { BarService } from 'src/app/services/bar.service';
import { PrizeService } from 'src/app/services/prize.service';
import { ParseArrayToDatePipe } from 'src/app/shared/pipes/parse-array-to-date';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-prize-detail',
  templateUrl: './prize-detail.component.html',
  styleUrls: ['./prize-detail.component.scss']
})
export class PrizeDetailComponent implements OnInit {

  bar!: Bar;
  idPrize!: number;
  prize!: Prize;
  formGroup!: FormGroup;
  minDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private barService: BarService,
    private prizeService: PrizeService,
    private formBuilder: FormBuilder,
    private parseArrayToDatePipe: ParseArrayToDatePipe,
  ) { }

  ngOnInit(): void {
    const idBar = +this.route.snapshot.paramMap.get('id')!;
    this.idPrize = +this.route.snapshot.paramMap.get('idPrize')!;

    if(!idBar || !this.idPrize) this.goToHome();

    this.getCurrentBar(idBar);
  }

  private goToHome(): void {
    this.router.navigate(['/']);
  }

  buildForm() {
    if(this.prize.startDate) {
      this.prize.startDate = this.parseArrayToDatePipe.transform(this.prize.startDate)
    }
    if(this.prize.endDate) {
      this.prize.endDate = this.parseArrayToDatePipe.transform(this.prize.endDate)
    }

    this.formGroup = this.formBuilder.group({
      name: [this.prize.name, [Validators.required]],
      points: [this.prize.points, [Validators.required]],
      startDate: [this.prize.startDate],
      endDate: [this.prize.endDate],
    });
  }

  private getCurrentBar(idBar: number): void {
    const barObserver: PartialObserver<Bar> = {
      next: async (bar: Bar) => {
        this.bar = bar;
        this.getPrize();
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  private getPrize(): void {
    this.prizeService.findById(this.idPrize)
    .then((prize: Prize) => {
      if(prize)
        this.prize = prize;
      this.buildForm();
    })
    .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message))
  }

  submitForm(): void {
    if (this.formGroup.valid) {
      const updatedPrize: Prize = {
        id: this.prize.id,
        name: this.name.value.trim(),
        points: this.points.value,
        startDate: this.startDate.value,
        endDate: this.endDate.value,
        bar: this.bar.id!,
        active: this.prize.active,
      }

      this.prizeService.saveOrUpdate(updatedPrize)
      .then((prize: Prize) => this.toastService.openSuccessToast('Premio actualizado exitosamente!'))
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error.message));
    }
  }


  toggleActive(): void {
    this.prizeService.updateActive(this.prize.id!)
      .then((prize: Prize) => {
        this.prize.active = prize.active;
        const status = this.prize.active ? 'activado' : 'desactivado';
        this.toastService.openSuccessToast(`Premio ${this.prize.name} ${status} exitosamente!`);
      })
      .catch(() => this.toastService.openErrorToast('Ocurrió un error al actualizar el premio'))
  }

  displayItemFn(item?: any): string {
    return item?.name ? item.name : "";
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get points() { return this.formGroup.get('points') as FormControl }
  get startDate() { return this.formGroup.get('startDate') as FormControl }
  get endDate() { return this.formGroup.get('endDate') as FormControl }

}
