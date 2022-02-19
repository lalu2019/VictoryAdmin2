import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../_services/alert.service';
import { AlertType } from '../../_models/alert-model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  alert: any = {};
  constructor(private alertService: AlertService) {
    this.subscription = alertService.showAlert.subscribe(
      alertData => {
        if (alertData) {
          this.alert.Show = true;
          this.alert.Message = alertData.message;
          this.alert.Type = alertData.type;
          setTimeout(() => {
            this.alert.Show = false;
          }, 5000)
        }
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
