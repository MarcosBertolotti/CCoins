import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WarningType } from '../../enums/warning-type.enum';

@Component({
  selector: 'app-login-warning',
  templateUrl: './login-warning.component.html',
  styleUrls: ['./login-warning.component.scss']
})
export class LoginWarningComponent implements OnInit {

  messages: any = {
    [WarningType.LOGOUT]: () => 'Gracias por haber participado, escanea el código QR de tu mesa para seguir sumando puntos a tu party',
    'default': () => 'Primero debe escanear el código QR de la mesa para disfrutar de la aplicación',
  };

  message!: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this.route.queryParams.subscribe((params: any) => {
      const warningType: string = params?.type;

      this.message = (this.messages[warningType] || this.messages['default'])();
    });
  }

}
