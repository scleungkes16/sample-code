import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'payment-info-dialog',
  templateUrl: '/payment-info-dialog.component.html',  
  encapsulation: ViewEncapsulation.None
})
export class PaymentInfoDialogComponent {
  
  @Input() private payment;

  closeResult: string;

  constructor(private currencyPipe:CurrencyPipe,
              private modalService:NgbModal) {
  }

  ngOnInit() {

  }

  open(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

}
