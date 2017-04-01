import { Component, Input, Inject} from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from '../providers/auth-service';

/*
  Generated class for the ShowTask page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'button-group',
  templateUrl: 'button-group.component.html'
})
export class ButtonGroupComponent {
  _item: any;
   firebase: any;
  constructor(public auth: AuthService, public navCtrl: NavController, public navParams: NavParams,
               @Inject(FirebaseApp) firebaseApp: any,
               public viewCtrl: ViewController) {
      this.item = this.navParams.get("item");
      this.firebase = firebaseApp;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  closeAndMarkAsCompleted() {
    this.viewCtrl.dismiss({markAsCompleted: true});
  }

  closeAndMarkAsUrgente() {
    this.viewCtrl.dismiss({markAsUrgent: true});
  }


  closeAndDelete() {
    this.viewCtrl.dismiss({delete: true});
  }

  @Input()
  set item(item) {
    this._item = item;
  }

  get item() {
    return this._item;
  }

}
