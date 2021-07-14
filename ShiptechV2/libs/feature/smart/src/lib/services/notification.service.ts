import { Injectable } from '@angular/core';
import { AngularFirestore} from '@angular/fire/firestore';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
@Injectable()
export class notificationService {

  messaging = firebase.messaging()
  currentMessage = new BehaviorSubject(null)

  constructor( private db: AngularFireDatabase, private afAuth: AngularFireAuth, private firestore:AngularFirestore) {
    
  }
  updateToken(token) {
    this.afAuth.authState.pipe(take(1)).subscribe(user => {
        console.log(user);

        this.afAuth.authState.pipe(take(1)).subscribe(
        () => {
            const data = {};
            data['123'] = token
            // this.db.object('fcmTokens/').update(data);
            // console.log(this.db.list);
        },
        (err) => {
            console.error('Token error.', err);
        }
        )
    })
  }
  getPermission() {
    this.messaging.requestPermission()
    .then(() => {
      console.log('Notification permission granted.');
      return this.messaging.getToken()
    })
    .then(token => {
      console.log(token)
      this.updateToken(token)
    })
    .catch((err) => {
      console.log('Unable to get permission to notify.', err);
    });
  }

  receiveMessage() {
      console.log("Test");
     this.messaging.onMessage((payload) => {
      console.log("Message received. ", payload);
      this.currentMessage.next(payload)
    });

  }
  /// With subscription
  signIn(){
      this.afAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider());
      this.receiveMessage();
  }

  signOut(){
      this.afAuth.auth.signOut();
  }

  subscribeToNotifications(){
      this.messaging.requestPermission()
      .then(() => this.handleTokenRefresh())
      .catch(() => console.log("user didn't give permission !!"))
  }


  getreceiveMessage() {
    console.log("Test");
    this.messaging.onMessage((payload) => {
    console.log("Message received. ", payload);
    this.currentMessage.next(payload)
    });
  }

  unsubscribeFromNotifications(){
      this.messaging.getToken()
      .then((token) => this.messaging.deleteToken(token))
      .then(() => this.db.database.ref('/tokens').orderByChild('uid').equalTo(this.afAuth.auth.currentUser.uid)
      .once('value'))
      .then((snapshot) =>{
          console.log(snapshot);
          const key = Object.keys(snapshot.val())[0];
          return this.db.database.ref('/token').child(key).remove();
      })
  }

  handleTokenRefresh(){
      return  this.messaging.getToken()
      .then((token) =>{
          console.log("TOKEN ***", token);
          console.log("Current User ***", this.afAuth.auth.currentUser);
          this.db.database.ref('/tokens').push({
              token:token
              //uid:this.afAuth.auth.currentUser.uid
          })
      })
  }

  checkSubscription(){
    this.db.database.ref('/tokens').orderByChild('uid').equalTo(this.afAuth.auth.currentUser.uid).once('value')
    .then((snapshot)=> {
      if(snapshot.val()){
        //hide subscription button
      }
      else{
        //hide unsubscription button
      }
    })
  }

//CRUD
getAlerts() {
  let tenantId = localStorage.getItem('TenantId') == undefined ? "0" :localStorage.getItem('TenantId');       
  let userId =localStorage.getItem('UserId')==undefined? "0":localStorage.getItem('UserId');
  let itemsCollection = this.firestore.collection('alerts').doc(tenantId).collection<any>(userId, x => x.orderBy('LastUpdatedDate', 'desc'));
  return itemsCollection.snapshotChanges();
}
  
}






