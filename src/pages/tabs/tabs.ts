import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GradesPage } from '../grades/grades';
import { CalcPage } from '../calc/calc';
import { LoginPage } from '../login/login';

import { AuthProvider } from '../../providers/auth/auth';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab2Root = GradesPage;
  tab3Root = CalcPage;

  constructor(private _NAV : NavController, private _AUTH : AuthProvider) {

  }

  logOut() : void {

  	this._AUTH.logOut().then((data : any) => {

  		this._NAV.setRoot(LoginPage);

  	}).catch((error : any) => {

  		console.dir(error);

  	});

  }

}