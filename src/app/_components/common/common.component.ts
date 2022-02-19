import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OperationsService } from '../../_services/operations.service'
import readXlsxFile from 'read-excel-file'
import { LoaderService } from 'src/app/_services/loader.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { AlertService } from 'src/app/_services/alert.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss']
})
export class CommonComponent implements OnInit {

  createStoryForm: FormGroup;
  createBook: FormGroup;
  membershipForm: FormGroup;
  tipsForm: FormGroup;
  contacUsForm: FormGroup;

  isActiveButton: any = 'btn1'

  apiResponse: any = [];
  BookList: any = [];
  membershipList: any = [];
  contactUslList: any = [];
  tipsList: any = [];
  selectedRecordForEdit: any = {};


  subscription: Subscription;
  deleteRcordId: any;
  deleteRecordType: any;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  constructor(
    private formBuilder: FormBuilder,
    private operation: OperationsService,
    private loaderService: LoaderService,
    private confirmationDialogService: ConfirmationDialogService,
    private alertService: AlertService
  ) {

    this.subscription = this.confirmationDialogService.isConfirmationYesButtonClick.subscribe(status => {
      if (status) {

        if (this.deleteRecordType == 'membership') {
          this.loaderService.show();
          this.operation.deleteMembership(this.deleteRcordId).then(success => {
            console.log(success);
            this.loaderService.hide();
            this.alertService.delete();
            this.getMemberships();

          })
        }
       
      }
    });
  }


  setActive(buttonName) {
    this.isActiveButton = buttonName;
  }

  isActive = function (buttonName) {
    return this.isActiveButton === buttonName;
  }

  ngOnInit(): void {
    this.getMemberships();

    this.createStoryForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      link: ['',],
      storyPicture: ['',],
    });
    this.createBook = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      imageUrl: [''],
      description: [''],
      link: ['', Validators.required],
    });

    this.contacUsForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      Name: ['', Validators.required],
      Email: [''],
      Mobile: [''],
    });
    this.tipsForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      picture: [''],
      Reference: [''],
    });

    this.membershipForm = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: [''],
      actual_amount: ['', Validators.required],
      offer_amout: [''],
      offer_end: [''],
      offer_terms: ['']
    });

  }



  editMembership(selected) {
    this.membershipForm.controls.id.setValue(selected.id)
    this.membershipForm.controls.title.setValue(selected.title)
    this.membershipForm.controls.description.setValue(selected.description)
    this.membershipForm.controls.actual_amount.setValue(selected.actual_amount)
    this.membershipForm.controls.offer_amout.setValue(selected.offer_amout)
    this.membershipForm.controls.offer_end.setValue(selected.offer_end)
    this.membershipForm.controls.offer_terms.setValue(selected.offer_terms)
  }
  updateMembership() {
    let record = {};
    record['title'] = this.membershipForm.value.title
    record['description'] = this.membershipForm.value.description
    record['actual_amount'] = this.membershipForm.value.actual_amount
    record['offer_amout'] = this.membershipForm.value.offer_amout
    record['offer_end'] = this.membershipForm.value.offer_end
    record['offer_terms'] = this.membershipForm.value.offer_terms
    this.loaderService.show();
    this.operation.updateMembership(this.membershipForm.value.id, record).then(success => {
      this.loaderService.hide();
      this.alertService.update();
      this.membershipForm.reset();
      this.getMemberships();
    })
  }

  addMembership() {

    let record = {};
    record['title'] = this.membershipForm.value.title
    record['description'] = this.membershipForm.value.description
    record['actual_amount'] = this.membershipForm.value.actual_amount
    record['offer_amout'] = this.membershipForm.value.offer_amout
    record['offer_end'] = this.membershipForm.value.offer_end
    record['offer_terms'] = this.membershipForm.value.offer_terms
    record['createdDate'] = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    this.loaderService.show();
    this.operation.addMembership(record).then(success => {
      this.loaderService.hide();
      this.alertService.save();
      this.membershipForm.reset();
      this.getMemberships();
    })
  }
  getMemberships() {

    this.loaderService.show();
    this.operation.getMembership().subscribe(success => {
      console.log(success);
      this.loaderService.hide();
      this.membershipList = success.map(e => {
        return {
          id: e.payload.doc.id,
          title: e.payload.doc.data()['title'],
          description: e.payload.doc.data()['description'],
          actual_amount: e.payload.doc.data()['actual_amount'],
          offer_amout: e.payload.doc.data()['offer_amout'],

          offer_end: e.payload.doc.data()['offer_end'],
          offer_terms: e.payload.doc.data()['offer_terms'],
          createdDate: e.payload.doc.data()['createdDate']

        };
      })
      console.log(this.membershipList);
    })

  }




  

  

  editContact(selected) {
    debugger;
    this.contacUsForm.controls.id.setValue(selected.id)
    this.contacUsForm.controls.title.setValue(selected.title)
    this.contacUsForm.controls.Name.setValue(selected.Name)
    this.contacUsForm.controls.Email.setValue(selected.Email)
    this.contacUsForm.controls.Mobile.setValue(selected.Mobile)
  }
  updateContact() {
    let record = {};
    record['title'] = this.contacUsForm.value.title
    record['Name'] = this.contacUsForm.value.Name
    record['Mobile'] = this.contacUsForm.value.Mobile
    record['Email'] = this.contacUsForm.value.Email
    this.loaderService.show();
   
  }

  // Contact Us Section 

  

  deleteConfirmation(value, type) {

    this.confirmationDialogService.show();
    this.deleteRcordId = value.id;
    this.deleteRecordType = type;
  }

}
