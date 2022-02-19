import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  private isConfirmationModalOpenSubject: BehaviorSubject<boolean>;
  public isConfirmationModalOpen: Observable<boolean>;
  private isConfirmationYesButtonClickSubject: BehaviorSubject<boolean>;
  public isConfirmationYesButtonClick: Observable<boolean>;

  constructor(
  ) {
    this.isConfirmationModalOpenSubject = new BehaviorSubject<any>(false);
    this.isConfirmationModalOpen = this.isConfirmationModalOpenSubject.asObservable();
    this.isConfirmationYesButtonClickSubject = new BehaviorSubject<any>(false);
    this.isConfirmationYesButtonClick = this.isConfirmationYesButtonClickSubject.asObservable();
  }

  show() {
    this.isConfirmationModalOpenSubject.next(true);
  }
  hide() {
    this.isConfirmationModalOpenSubject.next(false);
  }

  confirmationYesButtonClick(status) {
    this.isConfirmationYesButtonClickSubject.next(status);
  }
}
