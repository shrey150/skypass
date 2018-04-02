import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class GradebookProvider {

	constructor() {}

	fetchAll(dataLit : string) {

		var trimmedUsername = firebase.auth().currentUser.email.replace("@shreypandya.com", "");
		var classes = [];

		firebase.database().ref(trimmedUsername + "/grades/" + dataLit).once("value").then(snapshot => {

			var i = 0;

			snapshot.forEach(childSnapshot => {

				var name = childSnapshot.child("info/course").val();
				var finalGrade = 0;

				var weightPool = 100;
				var redoGrades = [];

				var finalEarned = 0;
				var finalTotal = 0;

				//console.log("-------------------");
				//console.log(name);
				//console.log("-------------------");

				childSnapshot.child("report").forEach(categorySnapshot => {

					var weight = categorySnapshot.child("weight").val();
					var earned = categorySnapshot.child("score/earned").val();
					var total = categorySnapshot.child("score/total").val();

					//console.log("Weight " + weight + ", earned " + earned + ", total " + total);

					var grade = weight * (earned / total);
					finalEarned += earned;
					finalTotal += total;

					//console.log("Calculated: " + grade);

					if (!isNaN(grade)) {

						finalGrade += grade;

					} else {

						//console.log("Not adding to grade!");

					}

					weightPool -= weight;

					if (weight == 0 && total !== null) {

						//console.log("Incorrect scrape!");

						redoGrades.push(earned / total);

					} else if (weight === null && total !== null) {

						//console.log("Default weightage to be added");

						redoGrades.push(earned / total);

					}


				});

				//console.log("Excess weight: " + weightPool);

				if (redoGrades.length > 0) {

					finalGrade += weightPool * redoGrades[0];

				}

				console.log("Grade in " + name + ": " + finalGrade.toFixed(2));

				classes.push({ name: name, grade: finalGrade.toFixed(2), index: i, score: {earned: finalEarned, total: finalTotal} });

				i++;

			});

		});

		return classes;

	}

	fetchClass(markingPd : string, index : string) {

		var user = firebase.auth().currentUser.email.replace("@shreypandya.com", "");
		var userClass = [];

		firebase.database().ref(user + "/grades/" + markingPd + "/" + index + "/report").once("value").then(snapshot => {

			snapshot.forEach(childSnapshot => {

				if (childSnapshot.child("score").exists()) {

					userClass.push(childSnapshot.val());

				}

			});

			var weightPool = 100;
			var i = 0;

			var fixIndex = 0;

			userClass.forEach(element => {

				weightPool -= element.weight;

				if (element.weight == 0) {

					fixIndex = i;

				}

			});

			userClass[fixIndex].weight = weightPool;

		});

		return userClass;

	}

}
