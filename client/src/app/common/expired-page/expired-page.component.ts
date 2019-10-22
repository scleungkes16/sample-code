import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'expired-page',
  templateUrl: '/expired-page.component.html'
})

export class ExpiredPageComponent {

  constructor(private _router: Router) { 

  }

  ngOnInit() {

  }

  onRefreshSession(){
  	this._router.navigate(['/']);	
  }
}