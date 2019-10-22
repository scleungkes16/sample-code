import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  		<div *ngIf="isShowWarning" class="stagingBanner">
  			<h3>WARNING!! This is the staging environment.</h3>
  		</div>
  		<div class="container-box"> 
				<router-outlet></router-outlet>
			</div>
  `})

export class AppComponent {

	private isShowWarning:boolean = false;

  ngOnInit() {
  		this.isShowWarning = (document.location.href.indexOf('staging.coinetion.com') !== -1);
  }

}
