import { Injectable } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

import { Observable, Subscription } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';



@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private http:HttpClient
    // private storage: AngularFireStorage,
  ) { 
    ///this.sendPushNotification()
  }

  addToken(record) {
    return this.firestore.collection('frbTkn').add(record);
  }
  
  //Users Section
  createUsers(record) {
    return this.firestore.collection('Users').add(record);
  }

  updateUsers(recordID, record)  {
    return this.firestore.doc('Users/' + recordID).update(record);
  }

  getAllUsers(): Observable<any> {
    return this.firestore.collection('Users').snapshotChanges();
  }

 
  //Mmbership  section api
  addMembership(record) {
    return this.firestore.collection('Membership').add(record);
  }
  getMembership(): Observable<any> {
    return this.firestore.collection('Membership').snapshotChanges();
  }
  updateMembership(recordID, record) {
    return this.firestore.doc('Membership/' + recordID).update(record);
  }
  deleteMembership(record_id) {
    return this.firestore.doc('Membership/' + record_id).delete();
  }

  
  //Category  section api
  addCategories(record) {
     return this.firestore.collection('ChildCategory').add(record);
  }
  // addCategories(record) {


  //   return this.firestore.collection('Category').doc('szn7HEe3fvqVNypjszem').collection('child').add(record);
  // }
  getAllIomage(){
    // return new Promise((resolve, reject) => {
      this.storage.ref('/A_PRODUCT/1.JPG').getDownloadURL().subscribe((url) => {
          console.log(url)
      })
    // })
}
  getCaetgories() {
   // this.getAllIomage() 
    return this.firestore.collection('Category').snapshotChanges();
  }
  addMainCat(record) {
    return this.firestore.collection('Category/').add(record);
  }
  updateMainCat(record, recordID) {
    return this.firestore.doc('Category/' + recordID).update(record);
  }
  deletMain(record_id) {
    return this.firestore.doc('Category/' + record_id).delete();
  }

  deletchildCat(record_id) {
    return this.firestore.doc('ChildCategory/' + record_id).delete();
  }
  updateChildCat(record, recordID) {
    return this.firestore.doc('ChildCategory/' + recordID).update(record);
  }

  addChildCate(record) {
    return this.firestore.collection('ChildCategory/').add(record);
  }

  deleteProduct(productId, childId) {
    // return this.firestore.collection('ChildCategory/' + childId).doc('products/' + productId).delete();
    return this.firestore.collection('ChildCategory').doc(childId.toString()).collection('products').doc(productId.toString()).delete();

  }
  addProducts(chil_id, record) {
    //his.firestore.collection('ChildCategory').add(record);
    console.log(chil_id.toString())
    return this.firestore.collection<any>('ChildCategory').doc(chil_id.toString()).collection("products").add(record);
  }
  getProducts(child_id: any): Promise<any[]> {
    return this.firestore.collection<any>('ChildCategory').doc(child_id).collection("products")
    .get().toPromise().then((ref) => {
      return ref.docs;
    })
  }
  getChild() {
    return this.firestore.collection('ChildCategory').snapshotChanges();
   //this.getcategoryWithChild();    
  }
   getcategoryWithChild() {
     let parentArray = []
    const snapshot = this.firestore.collection('Category').get().map(data => {
      data.docs.forEach(doc => {
        //console.log(doc.data())
        let subCollectionDocs = this.firestore.collection('Category').doc(doc.id).collection("child").get()
        .map(snapshot => {
          let childArray = [];
          snapshot.forEach(child => {
            childArray.push({
              id:child.id,
              name:child.data()['name'],
              icon:child.data()['icon']
            }) 
            
          })
          parentArray.push({id:doc.id, name:doc.data()['name'], child:childArray})
          console.log(parentArray);
        }).toPromise()
        .catch(err => {
          console.log(err);
        });
        
      })
      
    })
    .toPromise()
    .catch(err => {
      console.log(err);
    });
   }


  //Enquery Section
  AddInquery(record) {
    return this.firestore.collection('Enquery').add(record);
  }
  getInquiry(): Observable<any> {
    return this.firestore.collection('Enquery').snapshotChanges();
  }

  getTokens(): Observable<any> {
    return this.firestore.collection('DeviceTkn').snapshotChanges();
  }

  sendPushNotification(title, description, tokens){

    const headers = new HttpHeaders()
            .set("Content-Type", "application/json").set("Authorization", "key=AAAAQVILWVU:APA91bET4lRNz_TwdevYjz5nLF1y0K2Shm_pW0nX0Ct58hw3bYd7XUoxXTbnyfGk42_P-4QC5SIONjKQS5wpZD3RTgkCfIa1Sm2HG1I90urqUxJ2ca0XbUKWC5B8s-21ZN5o-KNDn9jH")
       
              this.http.post("https://fcm.googleapis.com/fcm/send",
              {
                "topic" : "marketing",
                "notification":{
                    "title":title,
                    "body":description
                  },
                  "to":"/topics/marketing"
              }, {headers})
                .subscribe(
                    (val) => {
                        console.log("POST call successful value returned in body", 
                                    val);
                    },
                    response => {
                        console.log("POST call in error", response);
                    },
                    () => {
                        console.log("The POST observable is now completed.");
                    });


  }

}
