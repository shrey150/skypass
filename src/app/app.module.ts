import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts';
import { MyApp } from './app.component';

import { GradesPage } from '../pages/grades/grades';
import { CalcPage } from '../pages/calc/calc';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ClassPage } from '../pages/class/class';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { Push } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';
import { GradebookProvider } from '../providers/gradebook/gradebook';

@NgModule({
  declarations: [
    MyApp,
    GradesPage,
    CalcPage,
    TabsPage,
    LoginPage,
    ClassPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GradesPage,
    CalcPage,
    TabsPage,
    LoginPage,
    ClassPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    Push,
    FCM,
    GradebookProvider
  ]
})
export class AppModule {}
