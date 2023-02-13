import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { AppPaths } from 'src/app/enums/app-paths.enum';
import { Bar } from 'src/app/models/bar-model';
import { Prize } from 'src/app/models/prize.model';
import { BarService } from 'src/app/services/bar.service';
import { PrizeService } from 'src/app/services/prize.service';
import { ToastService } from 'src/app/shared/services/toast.services';

@Component({
  selector: 'app-prize-create',
  templateUrl: './prize-create.component.html',
  styleUrls: ['./prize-create.component.scss']
})
export class PrizeCreateComponent implements OnInit {

  bar!: Bar;
  formGroup!: FormGroup;
  minDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private barService: BarService,
    private prizeService: PrizeService,
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
      startDate: [''],
      endDate: [''],
    });
  }

  private getCurrentBar(idBar: number): void {
    const barObserver: PartialObserver<Bar> = {
      next: async (bar: Bar) => {
        this.bar = bar;
        this.buildForm();
      },
      error: (error: HttpErrorResponse) => { 
        this.toastService.openErrorToast(error.error?.message);
        this.goToHome();
      },
    };
    this.barService.getCurrentBar(idBar).subscribe(barObserver);  
  }

  submitForm(): void {
    if (this.formGroup.valid) {
      const newPrize: Prize = {
        name: this.name.value.trim(),
        points: this.points.value,
        startDate: this.startDate.value,
        endDate: this.endDate.value,
        bar: this.bar.id!,
        active: true,
      }

      this.prizeService.saveOrUpdate(newPrize)
      .then((prize: Prize) => {
        this.toastService.openSuccessToast('Premio creado exitosamente!');
        //this.router.navigate([AppPaths.ADMIN, AppPaths.BAR, this.bar.id, AppPaths.PRIZES, prize.id]);
        this.router.navigate([AppPaths.ADMIN, AppPaths.BAR, this.bar.id, AppPaths.PRIZES]);
      })
      .catch((error: HttpErrorResponse) => this.toastService.openErrorToast(error.error?.message));
    }
  }

  displayItemFn(item?: any): string {
    return item?.name ? item.name : "";
  }

  get name() { return this.formGroup.get('name') as FormControl }
  get points() { return this.formGroup.get('points') as FormControl }
  get startDate() { return this.formGroup.get('startDate') as FormControl }
  get endDate() { return this.formGroup.get('endDate') as FormControl }

}
