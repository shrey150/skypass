import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import firebase from 'firebase';
import { environment } from '../environments/environment'

import { LoginPage } from '../pages/login/login';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = LoginPage;

  constructor(public platform: Platform, public fcm: FCM, public alertCtrl: AlertController, statusBar: StatusBar, splashScreen: SplashScreen, public push: Push) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      //this.initPushNotifications();
    });

    firebase.initializeApp(environment.firebase);

  }

  initPushNotifications() {

    console.log("Initializing push notifications...");
    
    if (!this.platform.is("cordova")) {

      console.warn("Push notifications disabled. Run on a physical device to test.");
      return;

    }

    this.fcm.getToken().then(token => {

      console.log("Token: " + token);

    });

    this.fcm.onNotification().subscribe(data => {

      if (data.wasTapped) {

        console.log("Received in background");

      } else {

        console.log("Received in foreground");

      }

    });
    /*

    const options: PushOptions = {

      android: {

        senderID: "772831499108"

      },
      ios: {

        alert: "true",
        badge: "true",
        sound: "true"

      },
      windows: {}
    };

    const pushObject : PushObject = this.push.init(options);

    pushObject.on("registration").subscribe((data: any) => {

      console.log("Device registered.");
      console.log("Device token: " + data.registrationId);
      //send token to server

    });

    pushObject.on("notification").subscribe((data: any) => {

      console.log("Notification received.");
      console.log("Message: " + data.message);

      //if app is in use
      if (data.additionalData.foreground) {

        let alert = this.alertCtrl.create({

          title: "New grade",
          message: data.message,
          buttons: ["OK"]

        });

        alert.present();

      } else {

        //if app is not in use
        //TODO: make some kind of page to display message
        let alert = this.alertCtrl.create({

          title: "New grade",
          message: data.message,
          buttons: ["OK"]

        });

        alert.present();

      }

    });

    pushObject.on("error").subscribe(error => {

      console.error("Error with push notification: " + error);

    })
    */



  }
}
