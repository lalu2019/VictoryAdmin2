import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OperationsService } from '../../_services/operations.service'
import readXlsxFile from 'read-excel-file'
import { LoaderService } from 'src/app/_services/loader.service';
import { ConfirmationDialogService } from 'src/app/_services/confirmation-dialog.service';
import { AlertService } from 'src/app/_services/alert.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxImageCompressService } from 'ngx-image-compress';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

import { MouseEvent } from '@agm/core';

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    // google maps zoom level
    zoom: number = 8;
  
    // initial center position for the map
    lat: number = 51.673858;
    lng: number = 7.815982;
    markers: marker[] = [
      {
        lat: 51.673858,
        lng: 7.815982,
        label: 'A',
        draggable: true
      },
      {
        lat: 51.373858,
        lng: 7.215982,
        label: 'B',
        draggable: false
      },
      {
        lat: 51.723858,
        lng: 7.895982,
        label: 'C',
        draggable: true
      }
    ]

  sendNotificationForm: FormGroup;
  // createClassForm: FormGroup; 
  mainCategory: FormGroup;
  childCategory: FormGroup;
  createStoryForm: FormGroup;
  productForm: FormGroup;
  createBook: FormGroup;

  subscription: Subscription;


  isSubmitted: boolean = false;
  input = document.getElementById('input')

  apiResponse: any = [];
  BookList: any = [];
  UploadedFileContent: any = [];
  enquiryList: any = [];
  userListData: any = [];
  activeUsers: number = 0;
  freeUsers: number = 0;
  paidUsers: number = 0;
  inactiveUsers: number = 0;
  childCat:any = [];

  deleteStoryId: any
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter description here...',
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

  file: any;
localUrl: any;
localCompressedURl:any;
sizeOfOriginalImage:number;
sizeOFCompressedImage:number;
isUploading:boolean;
isUploaded:boolean;
private imageCollection: AngularFirestoreCollection<any>;
  images: any;

  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  productsList: any = [];
  childCategorylist:any = [];
  filteredChild:any = [];
  selectedChildCat:any;

  constructor(
    private formBuilder: FormBuilder,
    private operation: OperationsService,
    private loaderService: LoaderService,
    private confirmationDialogService: ConfirmationDialogService,
    private alertService: AlertService,
    private imageCompress: NgxImageCompressService,
    private storage: AngularFireStorage, private database: AngularFirestore,
    
  ) {
    this.subscription = this.confirmationDialogService.isConfirmationYesButtonClick.subscribe(status => {
      if (status) {
        this.loaderService.show();
      
      }
    });

    this.imageCollection = database.collection<any>('Users');
    this.images = this.imageCollection.valueChanges();
  }

  get sendNotificationFormValidate() { return this.sendNotificationForm.controls; }

  selectFile(event: any) {
    var  fileName : any;
    this.file = event.target.files[0];
    fileName = this.file['name'];
    if (event.target.files && event.target.files[0]) {
    var reader = new FileReader();
    reader.onload = (event: any) => {
    this.localUrl = event.target.result;
    this.compressFile(this.localUrl,fileName)
    }
    reader.readAsDataURL(event.target.files[0]);
    }
    }
    imgResultBeforeCompress:string;
    imgResultAfterCompress:string;
    compressFile(image,fileName) {
    var orientation = -1;
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image)/(1024*1024);
    console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 50, 50).then(
    result => {
    this.imgResultAfterCompress = result;
    this.localCompressedURl = result;
    this.sizeOFCompressedImage = this.imageCompress.byteCount(result)/(1024*1024)
    console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
    // create file from byte
    const imageName = fileName;
    // call method that creates a blob from dataUri
    const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
    //imageFile created below is the new compressed file which can be send to API in form data
    const imageFile = new File([result], imageName, { type: 'image/jpeg' });
     this.firbaseUploadImage(imageFile)
     
    });}
    dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
    }

    firbaseUploadImage(event) {
      var n = Date.now();
      const file = event.target.files[0];
      console.log(file)
      const filePath = `ProductImage/${n}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(`ProductImage/${n}`, file);
      task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadURL = fileRef.getDownloadURL();
            this.downloadURL.subscribe(url => {
              if (url) {
                this.fb = url;
              }
              console.log(this.fb);
              this.addImagePath(this.fb)
            });
          })
        )
        .subscribe(url => {
          if (url) {
            console.log(url);
          }
        });
    }
   addImagePath(url){
      let record = {}
       record["link"] = url
       this.operation.addProducts(this.productForm.value.child, record).then(success =>{
        this.fetchProducts();
       })
   }
   fetchProducts(){
    this.selectedChildCat = this.productForm.value.child;
    this.operation.getProducts(this.productForm.value.child).then(success =>{
      this.productsList = success.map(e => {
        console.log(e);
        return {
          id: e.id,
          link: e.data()['link'],
        };
      })
      console.log(this.productsList);
    })
   }

   deleteSelectedProduct(value){
    
     this.operation.deleteProduct(value.id, this.productForm.value.child).then(success=>{
       console.log(success)
       this.fetchProducts();
     })
   }
   
  ngOnInit(): void {
   

    this.sendNotificationForm = this.formBuilder.group({
      messageText: ['', Validators.required],
      messageDescription: ['', Validators.required],
      //topic: ['', Validators.required]
    });


    this.mainCategory = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      status: ['Active', Validators.required],
      icon: ['', Validators.required],
      type:['New', Validators.required]
    });


    this.childCategory = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      status: ['Active', Validators.required],
      icon: [''],
      description: ['', Validators.required],
      parent: ['', Validators.required],
      type:['New', Validators.required],
      parentFilter:['']

    });
    this.productForm = this.formBuilder.group({
      id: [''],
      parent: ['', Validators.required],
      child: ['', Validators.required],
    });

    

    this.getChildCat();
    //this.addFirebaseToken();
    this.getMainCat();
    this.onValueChanges();
   // this.notificationProcess()
    //this.insertInquery();
    //Excel file upload code...

    const that = this;
    document.getElementById("fileImport").onchange= function(e: Event) {
      let file = (<HTMLInputElement>e.target).files[0];
      console.log(file);
      readXlsxFile(file).then((rows) => {
        console.log(rows);
        // `rows` is an array of rows
        // each row being an array of cells.
         that.UploadedFileContent = rows;
         for(let i=0;i<that.UploadedFileContent.length; i ++){
          that.insertCat(that.UploadedFileContent[i][0]);
         }

      })
     }

  }

  createCategory(){
    
    let record = {}
    record["name"] = this.mainCategory.value.name
    record["status"] = this.mainCategory.value.status
    record["icon"] = this.mainCategory.value.icon
    record["type"] = this.mainCategory.value.type
    record['createdDate'] = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    this.operation.addMainCat(record).then(sucees =>{
     this.alertService.save();
     this.mainCategory.reset();
     this.getMainCat()
    })
  }
  UpdateMainCat(){
     let record = {}
     record["name"] = this.mainCategory.value.name
     record["status"] = this.mainCategory.value.status
     record["type"] = this.mainCategory.value.type
     this.operation.updateMainCat(record, this.mainCategory.value.id).then(sucees =>{
      this.alertService.update();
      this.mainCategory.reset();
      this.getMainCat()
     })
  }
 editAction(value){
   console.log(value);
   this.mainCategory.controls.id.setValue(value.id)
   this.mainCategory.controls.name.setValue(value.name)
   this.mainCategory.controls.status.setValue(value.status)
   this.mainCategory.controls.icon.setValue(value.icon)
   this.mainCategory.controls.type.setValue(value.type)
 }

 deleteMain(value){
  
  this.operation.deletMain(value.id).then(sucees =>{
    this.alertService.delete();
    //this.mainCategory.reset();
    this.getMainCat()
   })
 }


 createChildCategory(){
    
  let record = {}
  record["name"] = this.childCategory.value.name
  record["status"] = this.childCategory.value.status
  record["icon"] = this.childCategory.value.icon
  record["parent"] = this.childCategory.value.parent
  record["description"] = this.childCategory.value.description
  record["type"] = this.childCategory.value.type
  record['createdDate'] = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
  console.log(record);
  this.operation.addChildCate(record).then(sucees =>{
   this.alertService.save();
   this.childCategory.reset();
   this.getChildCat()
  })
}


 UpdateChildCat(){
  let record = {}
  record["name"] = this.childCategory.value.name
  record["status"] = this.childCategory.value.status
  record["description"] = this.childCategory.value.description
  record["icon"] = this.childCategory.value.icon
  record["parent"] = this.childCategory.value.parent
  record["type"] = this.childCategory.value.type
  this.operation.updateChildCat(record, this.childCategory.value.id).then(sucees =>{
   this.alertService.update();
   this.childCategory.reset();
   //this.getChildCat()
  })
}

 editActionChild(value){
  console.log(value);
  this.childCategory.controls.id.setValue(value.id)
  this.childCategory.controls.name.setValue(value.name)
  this.childCategory.controls.status.setValue(value.status)
  this.childCategory.controls.icon.setValue(value.icon)
  this.childCategory.controls.parent.setValue(value.parent)
  this.childCategory.controls.description.setValue(value.description)
  this.childCategory.controls.type.setValue(value.type)
 

}
deleteChild(value){
 
 this.operation.deletchildCat(value.id).then(sucees =>{
   this.alertService.delete();
   //this.mainCategory.reset();
   this.getChildCat()
  })
}

  notificationProcess(){

    this.operation.sendPushNotification(this.sendNotificationForm.value.messageText, this.sendNotificationForm.value.messageDescription, 'tokens')
    this.alertService.save();
    this.sendNotificationForm.reset();
  }
  
  
  getDeviceTokens() {
    // this.loaderService.show();
    // this.operation.getTokens().subscribe(success => {
    //   this.loaderService.hide();
    //   let tokens = success.map(e => {
    //     return e.payload.doc.data()['token']
    //   })
    //   console.log(tokens);
    //   this.notificationProcess(tokens)
    // })
  }

  getMainCat() {
    this.loaderService.show();
    this.operation.getCaetgories().subscribe(success => {
      this.loaderService.hide();
      this.enquiryList = success.map(e => {
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          icon:e.payload.doc.data()['icon'],
          status:e.payload.doc.data()['status'],
          type:e.payload.doc.data()['type'],
        };
      })
      console.log(this.enquiryList);
    })
  }
  async insertCat(col1) {

    let record = {}
       record["link"] = col1
       this.operation.addProducts('7bZr5NUzV5xfaXLtEhOm', record).then(success =>{
       })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.confirmationDialogService.confirmationYesButtonClick(false);
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.sendNotificationForm.invalid) {
      return;
    }
  }

  addFirebaseToken() {
    let record = {};
    record['token'] = localStorage.getItem("firebaseTkn");
    record['Name'] = "Admin";
    record['Source'] = "Admin Panel";
    this.operation.addToken(record).then(success => {
      console.log(success);
    })
  }

  getChildCat() {
    this.loaderService.show();
    this.operation.getChild().subscribe(success => {
      this.loaderService.hide();
      this.childCat = success.map(e => {
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          icon:e.payload.doc.data()['icon'],
          status:e.payload.doc.data()['status'],
          parent:e.payload.doc.data()['parent'],
          description:e.payload.doc.data()['description'],
          type:e.payload.doc.data()['type'],
        };
      })
      this.filteredChild = this.childCat
      console.log(this.childCat);
    })
  }

  onValueChanges(): void {
    this.productForm.get('parent').valueChanges.subscribe(val=>{
      console.log(val);
      this.filterChildCat(val)
    });
    this.childCategory.get('parentFilter').valueChanges.subscribe(val=>{
      console.log(val);
      this.filterChilCatergory(val)
    });
  }

  filterChildCat(parent){
    this.childCategorylist = [];
    // console.log(parent)
    for(let i=0;i<this.childCat.length; i++){
      if(this.childCat[i].parent == parent){
        this.childCategorylist.push(this.childCat[i]);
      }
    }
   
  }
  filterChilCatergory(id){
    this.filteredChild = [];
    // console.log(parent)
    for(let i=0;i<this.childCat.length; i++){
      if(this.childCat[i].parent == id){
        this.filteredChild.push(this.childCat[i]);
      }
    }
   
  }
  

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }
  
  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }
  
  markerDragEnd(m: marker, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }


}
