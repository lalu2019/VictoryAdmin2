import { Injectable } from '@angular/core';
import { AlertType, AlertData } from '../_models/alert-model';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class AlertService {

  addExtraClass: boolean = false;
  private showAlertSubject: BehaviorSubject<AlertData>;
  public showAlert: Observable<AlertData>;
  constructor() {
    this.showAlertSubject = new BehaviorSubject<any>('');;
    this.showAlert = this.showAlertSubject.asObservable();
  }

  submitEmail() {
    this.showAlertSubject.next({ message: 'Email has been sent to reset your password. Please check your email', type: AlertType.Success });
  }

  save() {
    this.showAlertSubject.next({ message: 'Record created successfully', type: AlertType.Success });
  }

  update() {
    this.showAlertSubject.next({ message: 'Record updated successfully', type: AlertType.Update });
  }

  delete() {
    this.showAlertSubject.next({ message: 'Record deleted successfully', type: AlertType.Success });
  }

  deleteUnsuccessfull() {
    this.showAlertSubject.next({ message: 'Unable to delete record', type: AlertType.Success });
  }
  error(message: string) {
    this.showAlertSubject.next({ message: message, type: AlertType.Error });
  }
  success(message: string) {
    this.showAlertSubject.next({ message: message, type: AlertType.Success });
  }

  // success(message) {
  //   this.showAlertSubject.next({message:message,type: AlertType.Success});
  // }
}