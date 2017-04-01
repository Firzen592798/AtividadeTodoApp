import { Component, Inject } from '@angular/core';

import { ModalController, NavController, AlertController } from 'ionic-angular';

import { FirebaseApp, AngularFire, FirebaseListObservable} from 'angularfire2';


import { AuthService } from '../../providers/auth-service';

import {Camera} from 'ionic-native';

import { TaskMapPage } from "../task-map/task-map"


@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  txtTarefa: string;
  items: FirebaseListObservable<any>;
  size: number = 0;
  cameraData: string;
  imageData: string;
  marker: {latitude, longitude};
  firebase: any;

  constructor(public navCtrsl: NavController,
              private alertCtrl: AlertController, 
              af: AngularFire, 
              private auth: AuthService,
              @Inject(FirebaseApp) firebaseApp: any,
              private modalCtrl: ModalController) {

    this.firebase = firebaseApp;
    this.items = af.database.list('/todos/'+this.auth.uid);
    this.items.subscribe(
      val => this.size = val.length
    )

  }

  openMap(){
    let modal = this.modalCtrl.create(TaskMapPage);
    modal.present();
    modal.onDidDismiss(params => {
      if(params && params.marker) {
        this.marker = params.marker;
      }
    });
  }
  
  openCamera() {
    let options = {
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: true,
      allowEdit: true, //permite chamar um editor logo após tirar a foto
      // targetWidth: 100,
      // targetHeight: 100,
    };

    Camera.getPicture(options).then((imageData) => {
      this.imageData = imageData;
      this.cameraData = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      alert(err);
    });
  }


  salvarTarefa() : void {
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: this.txtTarefa,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Salvar',
          handler: () => {
            this.salvar();
          }
        }
      ]
    });
    alert.present();
  }

  salvar() : void {
    this.items.push({
        note: this.txtTarefa,
        date: (new Date()).getTime(),
        urgent: false,
        //marker: this.marker
    }).then(

        function(result){
          if(this.imageData) {
            this.firebase.storage().ref("/"+this.auth.uid+"/"+result.key)
            .putString(this.imageData, "base64")
            .then(

                function(snapshot) {
                  this.txtTarefa = "";
                  this.cameraData = null;
                  this.imageData = null;
                  
                }.bind(this)
                
            )
          } else {
            this.txtTarefa = "";
          }
        }.bind(this)

    );    
  }
}
