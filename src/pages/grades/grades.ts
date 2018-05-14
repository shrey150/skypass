import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import * as firebase from 'firebase';

import { ClassPage } from '../class/class'
import { GradebookProvider } from '../../providers/gradebook/gradebook';

@Component({
  selector: 'page-grades',
  templateUrl: 'grades.html'
})
export class GradesPage {

	mps = [];
	dataLits = ["1ST", "2ND", "3RD", "4TH"];
	dataLit = "4TH";

	loading;
	markingPd;

	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public gradebook : GradebookProvider) {

		this.showLoadingScreen();

		this.dataLits.forEach(element => {

			this.mps.push(gradebook.fetchAll(element));

		});

		gradebook.fetchMP().then(e => {

			this.markingPd = this.dataLits.indexOf(e);
			console.log(this.markingPd);

		});

	}

	
	// Loading screen code
	showLoadingScreen() {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		this.loading.present();

	}

	ionViewDidLoad() {

		this.loading.dismiss();

	}
	//-------------------------------------------------

	// Moves app to class overview page
	showClass(index, markingPd) {

		console.log(index, markingPd);

		console.log("Showing grades for " + this.mps[markingPd][index].name + " (" + this.dataLits[markingPd] + ")");

		this.navCtrl.push(ClassPage, {

			classData: this.mps[markingPd][index],
			index: index,
			markingPd: this.dataLits[markingPd]

		});

	}

}
