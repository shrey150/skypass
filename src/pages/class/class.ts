import { AccordionComponent } from './../../components/accordion/accordion';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import { GradebookProvider } from '../../providers/gradebook/gradebook';

@IonicPage()
@Component({
  selector: 'page-class',
  templateUrl: 'class.html',
})
export class ClassPage {

	generalClass = {};
	classData : any = [];
	sandboxData = [];
	sandboxInputs = {earned: null, total: null};

	sandboxMode = false;
	sandboxDone = false;
	sandboxGrade = null;
	sandboxScores = [];


	constructor(public navCtrl: NavController, public navParams: NavParams, public gradebook : GradebookProvider) {

		this.generalClass = navParams.get("classData");

		gradebook.fetchClass(navParams.get("markingPd"), navParams.get("index")).then(value => {

			this.classData = value;

		});

	}
	//--------------------------------------------------------------------------------------------------------------------------------------
	// Sandbox mode code

	toggleSandbox() {
		
		this.sandboxMode = !this.sandboxMode;
		this.sandboxData = this.classData;
		this.sandboxDone = false;
		this.sandboxScores = [];

	}

	addGrade(category : string) {

		var finalGrade = 0;

		if (this.sandboxMode) {

			for (var i = 0; i < this.sandboxData.length; i++) {

				// Get current category score
				var earned = this.sandboxData[i].score.earned;
				var total = this.sandboxData[i].score.total;

				console.log(this.sandboxData[i].category + " current score: " + earned + "/" + total);


				// selecting the correct category to modify
				if (this.sandboxData[i].category == category) {

					console.log("Modifying " + category);
					console.log("Adding assignment with a score of " + this.sandboxInputs.earned + "/" + this.sandboxInputs.total);

					earned += parseFloat(this.sandboxInputs.earned);
					total += parseFloat(this.sandboxInputs.total);

					console.log("New category score: " + earned + "/" + total);

				}

				console.log(this.sandboxData[i].weight + ", " + earned + "/" + total);

				// Recalculating grades for sandbox mode
				var grade = this.sandboxData[i].weight * (earned / total);
				finalGrade += grade;

			}

			console.log("New grade: " + finalGrade);


			// Displaying info on screen
			this.sandboxGrade = finalGrade.toFixed(2);
			this.sandboxScores.push({name: "Test Grade", score: {earned: this.sandboxInputs.earned, total: this.sandboxInputs.total}});
			this.sandboxDone = true;

		}

	}
	//--------------------------------------------------------------------------------------------------------------------------------------

}
