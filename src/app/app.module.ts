import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ErrorinterceptorService } from './_helpers/errorinterceptor.service';
import { JwtinterceptorService } from './_helpers/jwtinterceptor.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { HeaderComponent } from './_components/header/header.component';
import { FooterComponent } from './_components/footer/footer.component';
import { SidemenuComponent } from './_components/sidemenu/sidemenu.component';
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AlertComponent } from './_shared/alert/alert.component';
import { LoaderComponent } from './_shared/loader/loader.component';


import { AngularFirestoreModule , AngularFirestore, } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

// import {
//   AngularFireStorageModule,
//   AngularFireStorageReference,
//   AngularFireUploadTask,
//   StorageBucket
// } from "@angular/fire/storage";

// import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireDatabaseModule } from "@angular/fire/database";
// import { MessagingService } from "./_services/messaging.service";
import { environment } from "../environments/environment";
import { AsyncPipe } from "../../node_modules/@angular/common";
import { ConfirmationDialogComponent } from './_shared/confirmation-dialog/confirmation-dialog.component';
import { CommonComponent } from './_components/common/common.component';
import { OperationsService} from './_services/operations.service'
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AngularEditorModule } from '@kolkov/angular-editor';

import {NgxImageCompressService} from 'ngx-image-compress';

import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SidemenuComponent,
    LoaderComponent,
    AlertComponent,
    ConfirmationDialogComponent,
    CommonComponent,
 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    // AngularFireDatabaseModule,
    // AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebase, 'krisheebazar'),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    AngularEditorModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyAMu07HmeA1Tt096bHs9NSEVFut6elTy4Y'
    })
  ],
  providers: [
    // MessagingService,
    NgxImageCompressService,
    AsyncPipe,
    AngularFireStorage,
    OperationsService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
    // AngularFirestoreModule
    // { provide: HTTP_INTERCEPTORS, useClass: JwtinterceptorService, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorinterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
