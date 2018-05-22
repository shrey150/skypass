import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import {
   FormBuilder,
   FormGroup,
   Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';

import { TabsPage } from '../tabs/tabs';
import { AlertController } from 'ionic-angular';


@IonicPage()
@Component({
	selector: 'page-login',
	templateUrl: 'login.html',
})
export class LoginPage {

	public form : FormGroup;

	constructor(public alertCtrl : AlertController, public navCtrl: NavController, public navParams: NavParams, public _FB : FormBuilder, public _AUTH : AuthProvider) {

		// Set up a form template
		this.form = this._FB.group({
			"username" 	: ["", Validators.required],
			"password" 	: ["", Validators.required]
		})

	}

	// reusable code to show a popup
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

			// once the user is signed in,
			// move them into the main app
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

			// once the user is signed in,
			// move them into the main app
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
