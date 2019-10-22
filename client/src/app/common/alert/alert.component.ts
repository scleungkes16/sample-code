import { Component, Input } from '@angular/core';

@Component({
  selector: 'alert',
  templateUrl: '/alert.component.html'
})

export class AlertComponent {

	@Input() private errors:string[];
	@Input() private successMsg:string = '';
	@Input() private noticeMsg:string = '';

  constructor() { 
  
  }

}