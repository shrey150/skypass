import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

import * as firebase from 'firebase';
import * as NodeRSA from 'node-rsa';



@Injectable()
export class AuthProvider {

	public user : any;

	constructor(public http: Http) {

	  	firebase.auth().onAuthStateChanged((user) => {

			if (user) {

				console.log("Signed in!");

				this.user = user;

			} else {

				console.log("Not signed in!");

				this.user = null;

			}
		});

	}

	login(email : string, password : string) : Promise<any> {

		return new Promise((resolve, reject) => {

			firebase.auth().signInWithEmailAndPassword(email + "@shreypandya.com", password).then((val : any) => {

				resolve(val);

			}).catch((error : any) => {

				reject(error);

			});

		});

	}

	signup(email : string, password : string) : Promise<any> {

		return new Promise((resolve, reject) => {

			firebase.auth().createUserWithEmailAndPassword(email + "@shreypandya.com", password).then((val : any) => {

				resolve(val);

				// putting encrypted password in database

				const passwordNode = new NodeRSA();
				passwordNode.importKey(environment.publicKey, "pkcs8-public");

				const hash = passwordNode.encrypt(password, "base64");

				firebase.database().ref(email + "/user_data/password").set(hash);

			}).catch((error : any) => {

				reject(error);

			})

		})

	}

	logOut() : Promise<any> {

		return new Promise((resolve, reject) => {

			firebase.auth().signOut().then(() => {

				resolve(true);

			}).catch((error : any) => {

				reject(error);

			})

		})

	}

	/*

	login(username : string, password : string) : Promise<any> {

		return new Promise((resolve, reject) => {

			firebase.database().ref(username).once("value", snapshot => {

				if (snapshot.val() !== null) {

					console.log("Username exists!");

					const passwordNode = new NodeRSA();
					passwordNode.importKey(environment.publicKey, "pkcs8-public");

					const hash = passwordNode.encrypt(password, "base64");

					console.log(hash);

					//RSA hashes are unique... FIX

					if (snapshot.child("user_data/password").val() == hash) {

						console.log("Password matches!");

						resolve(true);

					} else {

						reject("Username or password is incorrect.");

					}

				} else {

					reject("Username or password is incorrect.");

				}

			})

		});

	}

	*/

}