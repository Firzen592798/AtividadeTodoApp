import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { ShowTaskPage } from '../pages/show-task/show-task';
import { EditTaskPage } from '../pages/edit-task/edit-task';
import { LoginPage } from '../pages/login/login';
import { TaskMapPage } from '../pages/task-map/task-map';
import { ShowTaskComponent } from '../components/show-task.component';
import { ButtonGroupComponent } from '../components/button-group.component';
import { AngularFireModule } from 'angularfire2';
import { AuthService } from '../providers/auth-service';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

import { AgmCoreModule } from 'angular2-google-maps/core';
 
export const firebaseConfig = {
  apiKey: "AIzaSyDBsHvTR0wYxf5V0b-C_JjoGErHJCEho8g",
  authDomain: "todo-5d8fc.firebaseapp.com",
  databaseURL: "https://todo-5d8fc.firebaseio.com",
  storageBucket: "todo-5d8fc.appspot.com",
  messagingSenderId: "901124139844"
};

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'd9067871'
  },
  'push': {
    'sender_id': '901124139844',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        'iconColor': '#343434'
      }
    }
  }
};

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    ShowTaskPage,
    EditTaskPage,
    LoginPage,
    ShowTaskComponent,
    ButtonGroupComponent,
    TaskMapPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    CloudModule.forRoot(cloudSettings),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAv1LUSVMAAAuQKzV8M9o1bGHP5DmlU4Aw'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    ShowTaskPage,
    EditTaskPage,
    LoginPage,
    TaskMapPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService]
})
export class AppModule {}
