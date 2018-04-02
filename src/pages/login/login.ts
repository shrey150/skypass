import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
   FormBuilder,
   FormGroup,
   Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';

import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';

// import * as firebase from 'firebase';

@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	public form : FormGroup;

	constructor(public alertCtrl : AlertController, public navCtrl: NavController, public navParams: NavParams, public _FB : FormBuilder, public _AUTH : AuthProvider) {
	
		this.form = this._FB.group({
			"username" 	: ["", Validators.required],
			"password" 	: ["", Validators.required]
		})

	}

	showAlert(title, message) {

		let alert = this.alertCtrl.create({
			title		: title,
			subTitle 	: message,
			buttons		: ["OK"]
		});

		alert.present();
	}

	logIn() {

		console.log("Logging in...");

		let username 	: any = this.form.controls["username"].value,
			password	: any = this.form.controls["password"].value;

		this._AUTH.login(username, password).then((auth : any) => {

			this.navCtrl.setRoot(TabsPage);

		}).catch((error : any) => {

			console.log(error.message);
			this.showAlert("Error", error.message);

		});
	}

	signUp() {

		console.log("Signing up...");

		let username 	: any = this.form.controls["username"].value,
			password	: any = this.form.controls["password"].value;

		this._AUTH.signup(username, password).then((auth : any) => {

			this.navCtrl.setRoot(TabsPage);

		}).catch((error : any) => {

			console.log(error.message);
			this.showAlert("Error", error.message);

		});

	}

	skip() {

		this.navCtrl.setRoot(TabsPage);

	}

}
