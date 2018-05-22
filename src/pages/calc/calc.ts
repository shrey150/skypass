import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GradebookProvider } from '../../providers/gradebook/gradebook';
import { ChartsModule } from 'ng2-charts';

@Component({
	selector: 'page-calc',
	templateUrl: 'calc.html'
})
export class CalcPage {

	classes = [];
	dataLits = ["1ST", "2ND", "3RD", "4TH", "Final"];
	dataLit = "4TH";
	check = {class: "", grade: "", mp: ""};

	results : any = {};

	//---------------------------------------------
	//Set up graph variables

	lineChartData : Array<any> = [];
  	lineChartLabels : Array<any> = [];
  	lineChartOptions : any = { responsive: true };
  	lineChartColors : Array<any> = [{ // dark grey
		backgroundColor: 'rgba(77,83,96,0.2)',
		borderColor: 'rgba(77,83,96,1)',
		pointBackgroundColor: 'rgba(77,83,96,1)',
		pointBorderColor: '#fff',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: 'rgba(77,83,96,1)'
    }];
  	lineChartLegend : boolean = false;
  	lineChartType : string = 'line';
  	//---------------------------------------------

	  calculated = false;

	constructor(public navCtrl: NavController, public gradebook: GradebookProvider) {

		gradebook.fetchMP().then(e => {

			this.check.mp = this.dataLits.indexOf(e.toString()).toString();
			this.classes = gradebook.fetchAll(this.dataLits[this.check.mp]);

		});

	}

	calculate() {

		console.log("Calculating...");
		console.log("MP: ", this.dataLits[this.check.mp]);

		var pointsNeeded;
		var graphData = [];

		this.classes.forEach(element => {

			if (element.name == this.check.class) {

				//THE ALGORITHM:
				// assume highest weighted category is most important
				// find minimum points of a 100% assignment needed to get to desired grade
				//
				// ALSO:
				// Calculate and display current grades to give a sense of context to the user
				// Build a graph showing their grade history

				var classGrades : any = this.gradebook.fetchClass(this.dataLits[this.check.mp], element.index);

				classGrades.then(value => {

					var highestWeight = 0;
					var highestName = "";

					var highestEarned = 0;
					var highestTotal = 0;

					var weightedTarget : any = this.check.grade;
					var targetGrade : any = 0;

					var oldGrade;
					var oldOverall;

					value.forEach(element => {

						// Find highest weighted category
						if (element.weight > highestWeight) {

							highestWeight = element.weight;
							highestEarned = element.score.earned;
							highestTotal = element.score.total;
							highestName = element.category;

						}

					});

					// Find weighted grade for highest category
					value.forEach(element => {

						if (element.weight !== highestWeight) {

							weightedTarget -= element.weight * (element.score.earned / element.score.total);

						}

					});

					// Find percentage grade for the category
					targetGrade = weightedTarget / highestWeight;

					console.log("Weighted: " + weightedTarget);
					console.log("Target: " + targetGrade);

					// Plug values into equation
					var pointsNeeded = ((targetGrade * highestTotal) - highestEarned) / (1 - targetGrade);

					// Display information to user
					this.results.pointsNeeded = Math.ceil(pointsNeeded);
					this.results.targetGrade = (100 * targetGrade).toFixed(2);
					this.results.name = highestName;

					this.results.oldGrade = (100 * highestEarned / highestTotal).toFixed(2);

				});


				var gradeHistory : any = this.gradebook.fetchClassOld(this.dataLits[this.check.mp], element.index);

				// Add points to a line graph showing the change in grades over time
				gradeHistory.then(value => {

					for (var i = 0; i < value.length; i++) {

						graphData.push(value[i].grade);

						console.log(value[i].grade);

					}

					graphData.push(element.grade);


					// Display the information to the user

					this.lineChartData = [];
					
					this.lineChartData.push({data: graphData, label: this.check.class});
					this.lineChartLabels = Array(graphData.length).fill("");

					this.calculated = true;

				});

			}

		});

	}

	chartHovered() {}

	chartClicked() {}

}
