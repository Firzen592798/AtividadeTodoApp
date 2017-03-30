import { Component, Inject } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { FirebaseApp} from 'angularfire2';
import { AuthService } from '../../providers/auth-service';


/*
  Generated class for the EditTask page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-edit-task',
  templateUrl: 'edit-task.html'
})
export class EditTaskPage {
  item: any;
  isUrgente: boolean;
  isFeita: boolean;
  txtTarefa: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
               public auth: AuthService,
               @Inject(FirebaseApp) firebaseApp: any,
               public viewCtrl: ViewController) {
      this.item = this.navParams.get("item");
      console.log("Status tarefa "+this.item.urgent+" - "+this.item.completed);
      this.txtTarefa = this.item.note;
      this.isUrgente = this.item.urgent;
      this.isFeita = this.item.completed;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  salvarTarefa() {
    this.viewCtrl.dismiss({nome: this.txtTarefa, urgent: this.isUrgente, feita: this.isFeita});
  }
}
