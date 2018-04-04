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

	results = {};

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

  	calculated = false;

	constructor(public navCtrl: NavController, public gradebook: GradebookProvider) {

		this.classes = gradebook.fetchAll(this.dataLit);

	}

	calculate() {

		console.log("Calculating...");
		 console.log(this.check);

		var pointsNeeded;
		var graphData = [];

		this.classes.forEach(element => {

			//console.log(element);

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

				var gradeHistory = this.gradebook.fetchClassOld(this.dataLit, element.index);

				gradeHistory.then(value => {

					for (var i = 0; i < value.length; i++) {

						graphData.push(value[i].grade);

					}

					graphData.push(element.grade);

				});

			}

		});

		console.log("Points needed: " + pointsNeeded);

		//this.results.pointsNeeded = pointsNeeded;

		this.lineChartData.push({data: graphData, label: this.check.class});
		//this.lineChartLabels = Array(graphData.length).fill("");
		this.lineChartLabels = ["", "", ""];

		console.log(this.lineChartData);
		console.log(this.lineChartLabels);

		this.calculated = true;

	}

	chartHovered() {}

	chartClicked() {}

}
