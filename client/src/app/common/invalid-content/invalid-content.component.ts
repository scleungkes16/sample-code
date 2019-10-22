import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'invalid-content',
  templateUrl: '/invalid-content.component.html'
})

export class InvalidContentComponent {

	@Input() private backUrl = ['/payment'];
	
  constructor(private _router: Router) { 
  }

	onBackSubmit() {
		this._router.navigate(this.backUrl);	
	}

}