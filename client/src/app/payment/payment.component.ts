import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'payment',
  templateUrl: '/payment.component.html'
})

export class PaymentComponent {

  constructor(private router: Router,
  						private authenticationService: AuthenticationService) { 
  }

	onLogOut() {
		this.authenticationService.logout();
		this.router.navigate(['']);  
	}
}