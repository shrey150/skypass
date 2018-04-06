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
	dataLit = "3RD";
	check = {class: "", grade: ""};

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

		this.classes = gradebook.fetchAll(this.dataLit);

	}

	calculate() {

		console.log("Calculating...");

		var pointsNeeded;
		var graphData = [];

		this.classes.forEach(element => {

			if (element.name == this.check.class) {

				//var pointScore = element.score.total * (this.check.grade / 100);
				//pointsNeeded = Math.ceil(pointScore - element.score.earned);

				//if (pointsNeeded < 0) {

				//	pointsNeeded = 0;

				//}

				//TODO: get value of each category .fetchClass()
				//and only try to work on the highest weighted category
				//
				//TWO APPROACHES: assume lowest weighted category
				//maintains same grade and find minimum points of a 100% assigment
				//needed to get to desired grade
				//
				//***this may be iffy, add in sandbox feature & graph stats first

				var classGrades : any = this.gradebook.fetchClass(this.dataLit, element.index);

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

						if (element.weight > highestWeight) {

							highestWeight = element.weight;
							highestEarned = element.score.earned;
							highestTotal = element.score.total;
							highestName = element.category;

						}

					});

					value.forEach(element => {

						if (element.weight !== highestWeight) {

							weightedTarget -= element.weight * (element.score.earned / element.score.total);

						}

					});

					targetGrade = weightedTarget / highestWeight;

					console.log("Weighted: " + weightedTarget);
					console.log("Target: " + targetGrade);

					var pointsNeeded = ((targetGrade * highestTotal) - highestEarned) / (1 - targetGrade);

					this.results.pointsNeeded = Math.ceil(pointsNeeded);
					this.results.targetGrade = (100 * targetGrade).toFixed(2);
					this.results.name = highestName;

					this.results.oldGrade = (100 * highestEarned / highestTotal).toFixed(2);

				});


				var gradeHistory : any = this.gradebook.fetchClassOld(this.dataLit, element.index);

				gradeHistory.then(value => {

					for (var i = 0; i < value.length; i++) {

						graphData.push(value[i].grade);

						console.log(value[i].grade);

					}

					graphData.push(element.grade);

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
