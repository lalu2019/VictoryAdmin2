import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
declare var $: any;

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  subscription: Subscription;

  constructor(
    private confirmationDialogService: ConfirmationDialogService
  ) {
    this.subscription = this.confirmationDialogService.isConfirmationModalOpen.subscribe(isModalOpen => {
      isModalOpen ? $('#confirmation-box-modal').modal('show') : $('#confirmation-box-modal').modal('hide');
    });
  }

  ngOnInit() {
  }

  onNoButtonClick() {
    this.confirmationDialogService.hide();
  }

  onYesButtonClick() {
    this.confirmationDialogService.hide();
    this.confirmationDialogService.confirmationYesButtonClick(true);
  }
}
