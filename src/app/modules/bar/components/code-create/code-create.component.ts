import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Prize } from 'src/app/models/prize.model';
import { ResponseList } from 'src/app/models/response-list.model';
import { PrizeService } from 'src/app/services/prize.service';
import { ToastService } from 'src/app/shared/services/toast.services';
import { codeService } from '../../services/code.service';
import { AppPaths } from 'src/app/enums/app-paths.enum';

@Component({
  selector: 'app-code-create',
  templateUrl: './code-create.component.html',
  styleUrls: ['./code-create.component.scss']
})
export class CodeCreateComponent implements OnInit {

  idBar!: number;
  formGroup!: FormGroup;
  prizes: Prize[] = [];
  minDate = new Date();
  rewards = [{ name: 'Puntos', value: 'points' }, { name: 'Premio', value: 'reward' }];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private codeService: codeService,
    private prizeService: PrizeService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  async ngOnInit(): Promise<void> {
    this.idBar = +this.route.snapshot.paramMap.get('id')!;
    if(!this.idBar) this.router.navigate(['/']);

    await this.getPrizes();
    this.buildForm();
  }

  buildForm(): void {
    this.formGroup = this.formBuilder.group({
      code: null,
      quantity: [1, [Validators.required, Validators.min(1)]],
      oneUse: false,
      perPerson: false,
      prize: null,
      points: [null, [Validators.min(1)]],
      expirationDate: null,
      expires: false,
      reward: [this.rewards[0], Validators.required],
    });

    this.code.valueChanges.subscribe((value: string) => {
      if(value)
        this.code.addValidators([Validators.minLength(6), Validators.maxLength(12), Validators.pattern(/^[A-Z0-9\\-]+$/)]);
      else
        this.code.clearValidators();
    });

    this.validateReward(this.reward.value?.value);
    this.reward.valueChanges.subscribe((value: { name: string, value: string }) => {
      this.validateReward(value?.value);
    })
  }

  private validateReward(value: string): void {
    if(value === 'points') {
      this.points.addValidators(Validators.required);
      this.prize.removeValidators(Validators.required);
      this.prize.setValue(null);
    } else if(value === 'reward') {
      this.prize.addValidators(Validators.required);
      this.points.removeValidators(Validators.required);
      this.points.setValue(null);
    }
    this.changeDetectorRef.detectChanges();
  }

  private async getPrizes(): Promise<void> {
    this.prizeService.findAllByBar(this.idBar)
    .then(({ list }: ResponseList<Prize>) => this.prizes = list || [])
    .catch((error: HttpErrorResponse) =>  this.toastService.openErrorToast(error.error?.message));
  }

  displayItemFn(item?: any): string {
    return item?.name || "";
  }
  
  submitForm(): void {
    const code = this.code.value?.trim();
    const newCode = {
      ...(code && code.length > 0 && { code }),
      quantity: this.quantity.value,
      oneUse: this.oneUse.value,
      perPerson: this.perPerson.value,
      prizeId: this.prize.value?.id || null,
      points: this.points.value || null,
      expirationDate: this.expirationDate.value || null,
      expires: this.expires.value,
    }

    this.codeService.create(newCode)
    .then(() => {
      this.toastService.openSuccessToast('Código creado exitosamente!');
      this.router.navigate([AppPaths.ADMIN, AppPaths.BAR, this.idBar, AppPaths.CODES]);
    })
    .catch((error: HttpErrorResponse) => {
      const message = error.error?.message?.includes('0050') ? 'El código ingresado ya está en uso.' : null;
      this.toastService.openErrorToast(message || error.error?.message);
      
    });
  }
  
  get code() { return this.formGroup.get('code') as FormControl }
  get quantity() { return this.formGroup.get('quantity') as FormControl }
  get oneUse() { return this.formGroup.get('oneUse') as FormControl }
  get perPerson() { return this.formGroup.get('perPerson') as FormControl }
  get prize() { return this.formGroup.get('prize') as FormControl }
  get points() { return this.formGroup.get('points') as FormControl }
  get expirationDate() { return this.formGroup.get('expirationDate') as FormControl }
  get expires() { return this.formGroup.get('expires') as FormControl }
  get reward() { return this.formGroup.get('reward') as FormControl }
}
