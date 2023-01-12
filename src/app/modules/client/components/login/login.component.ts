import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartialObserver } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/services/toast.services';
import { ClientPaths } from '../../enums/client-paths.eum';
import { ClientTableDTO } from '../../models/client-table.dto';
import { ClientService, IpAddress } from '../../services/client.service';

@Component({
  selector: 'app-login',
  template: '',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {
    const qrCode = this.route.snapshot.paramMap.get("code")!;

    this.login(qrCode);
  }

  login(qrCode: string): void {
    localStorage.clear();
    
    const loginObserver: PartialObserver<ClientTableDTO> = {
      next: (response: ClientTableDTO) => {
        this.clientService.clientTable = response;
        this.router.navigate([ClientPaths.HOME]);
      },
      error: () => this.handleLoginError()
    }
    this.clientService.getIPAddress()
    .pipe(
      switchMap((response: IpAddress) => {
        const ipAddress = response?.ip;
        if(!ipAddress)
          this.handleLoginError();
        return this.clientService.login(qrCode, ipAddress);
      })
    )
    .subscribe(loginObserver);
  }

  handleLoginError(): void {
    localStorage.clear();
    this.toastService.openErrorToast("Ha ocurrido un error al intentar ingresar a la mesa.");
    this.router.navigate([ClientPaths.WARNING_LOGIN]);
  }

}
