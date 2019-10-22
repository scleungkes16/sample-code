import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { AuthenticationService } from 'app/services/authentication.service';

@Component({
  selector: 'profile-welcome',
  templateUrl: '/profile-welcome.component.html'
})

export class ProfileWelcomeComponent {

  constructor(private router: Router) { 

  }

  ngOnInit() {
  }
}