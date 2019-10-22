import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { CurrencyPipe } from '@angular/common';
import { Helper } from 'app/common/helper/helper';

@Component({
  selector: 'channel-info-dialog',
  templateUrl: '/channel-info-dialog.component.html',  
  encapsulation: ViewEncapsulation.None
})
export class ChannelInfoDialogComponent {
  
  @Input() private channel;
  private expiredDate;

  closeResult: string;

  constructor(private currencyPipe:CurrencyPipe,
              private helper: Helper,
              private modalService:NgbModal) {
  }

  ngOnInit() {
  }

  open(content) {
    this.modalService.open(content, { windowClass: 'dark-modal' });
  }

}
