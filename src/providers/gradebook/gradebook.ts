import { Injectable } from '@angular/core';

import * as firebase from 'firebase';

@Injectable()
export class GradebookProvider {

	username : string;

	constructor() {

		this.username = firebase.auth().currentUser.email.replace("@shreypandya.com", "");;

	}

	fetchAll(dataLit : string) {

		var classes = [];

		firebase.database().ref(this.username + "/grades/" + dataLit).once("value").then(snapshot => {

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

				// For each category, get the score

				childSnapshot.child("report").forEach(categorySnapshot => {

					var weight = categorySnapshot.child("weight").val();
					var earned = categorySnapshot.child("score/earned").val();
					var total = categorySnapshot.child("score/total").val();

					//console.log("Weight " + weight + ", earned " + earned + ", total " + total);


					// Add the scores of the categories together

					var grade = weight * (earned / total);
					finalEarned += earned;
					finalTotal += total;

					//console.log("Calculated: " + grade);



					// ERROR CASE conditionals
					// (In case something goes wrong)

					if (!isNaN(grade)) {

						finalGrade += grade;

					} else {

						//console.log("Not adding to grade!");

					}

					weightPool -= weight;

					if (weight == 0 && total != null) {

						//console.log("Incorrect scrape!");

						redoGrades.push(earned / total);

					} else if (weight == null && total != null) {

						//console.log("Default weightage to be added");

						redoGrades.push(earned / total);

					}

				});

				//console.log("Excess weight: " + weightPool);

				if (redoGrades.length > 0) {

					finalGrade += weightPool * redoGrades[0];

				}

				console.log("Grade in " + name + ": " + finalGrade.toFixed(2));

				// Add class grade to list
				classes.push({ name: name, grade: finalGrade.toFixed(2), index: i, score: {earned: finalEarned, total: finalTotal} });

				i++;

			});

		});

		return classes;

	}

	fetchClass(markingPd : string, index : string) {

		return new Promise((resolve, reject) => {

			var userClass = [];

			firebase.database().ref(this.username + "/grades/" + markingPd + "/" + index + "/report").once("value").then(snapshot => {

				snapshot.forEach(childSnapshot => {

					if (childSnapshot.child("score").exists()) {

						// Get category data for a class and add to list
						userClass.push(childSnapshot.val());

					}

				});


				// ERROR CASE conditionals
				// (In case something goes wrong)

				var weightPool = 100;
				var i = 0;

				var fixIndex = null;

				userClass.forEach(element => {

					//console.log("Checking " + element.category);
					//console.log("Weight: " + element.weight);

					weightPool -= element.weight;

					if (element.weight == 0) {

						fixIndex = i;

					}

					i++;

				});

				if (fixIndex !== null) {

					userClass[fixIndex].weight = weightPool;

				}

			}).then(() => {resolve(userClass)});

		});

	}

	// This is used to get the grade history for a user

	fetchClassOld(markingPd : string, index : string) {

		return new Promise((resolve, reject) => {

			var grades = [];

			firebase.database().ref(this.username + "/grades/" + markingPd + "_old").once("value").then(snapshot => {

				snapshot.forEach(childSnapshot => {

					var oldGrade = childSnapshot.child(index).val();

					grades.push(oldGrade);

				});

			}).then(() => { resolve(grades) });

		});

	}

	fetchMP() {

		return new Promise((resolve, reject) => {

			var mp : string;

			firebase.database().ref(this.username + "/user_data/current_mp").once("value").then(snapshot => {

				mp = snapshot.val();

			}).then(() => { resolve(mp) });

		})

	}

}
