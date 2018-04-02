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

	classes = [];
	dataLit = "3RD";

	loading;

	constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public gradebook : GradebookProvider) {

		this.showLoadingScreen();
		this.classes = gradebook.fetchAll(this.dataLit);

	}

	showLoadingScreen() {

		this.loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		this.loading.present();

	}

	ionViewDidLoad() {

		this.loading.dismiss();

	}

	showClass(index, markingPd) {

		console.log("Showing grades for " + this.classes[index].name);
		//console.log(index + " " + markingPd)

		this.navCtrl.push(ClassPage, {

			classData: this.classes[index],
			index: index,
			markingPd: markingPd

		});

	}

}
