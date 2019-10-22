import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'user-profile',
  templateUrl: '/user-profile.component.html'
})

export class UserProfileComponent {

  constructor(private router: Router) { 

  }

  ngOnInit() {
  	localStorage.removeItem('merchantId');
  }

	onLogOut() {
	}
}