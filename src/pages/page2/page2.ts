import { Component, Inject } from '@angular/core';

import { ModalController, NavController, NavParams, ActionSheetController, reorderArray } from 'ionic-angular';

import { ShowTaskPage } from '../show-task/show-task';

import { FirebaseApp, AngularFire, FirebaseListObservable} from 'angularfire2';

import { AuthService } from '../../providers/auth-service';

import { EditTaskPage } from '../edit-task/edit-task';

import { Page1 } from '../page1/page1';

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  selectedItem: any;
  icons: string[];
  items: FirebaseListObservable<any>;
  showTaskPage = ShowTaskPage;
  editTaskPage = EditTaskPage;
  showOnlyCompletedActives = "1";
  limit = 15;
  firebase: any;
  reorder = false;
  itemsArray: any;
  page1=Page1;


  constructor(public navCtrl: NavController, 
              public modalCtrl: ModalController,
              public navParams: NavParams, 
              public af: AngularFire, 
              public actionSheetCtrl: ActionSheetController,
              public auth: AuthService,
              @Inject(FirebaseApp) firebaseApp: any) {
    
    this.firebase = firebaseApp;

    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');

    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];
    
    this.queryTasks(null);
  }

  queryTasks(infiniteScroll) {  
      if(this.showOnlyCompletedActives == "2") {
        this.items =  this.af.database.list('/todos/'+this.auth.uid, {
                        query: {
                          orderByChild: 'completed',
                          equalTo: true,
                          limitToFirst: this.limit
                        }
                      });
                      
      }else if(this.showOnlyCompletedActives == "3") {
        this.items =  this.af.database.list('/todos/'+this.auth.uid, {
                        query: {
                          orderByChild: 'not_completed',
                          equalTo: true,
                          limitToFirst: this.limit
                        }
                      });
                      
      } else {
        this.items =  this.af.database.list('/todos/'+this.auth.uid, {
                        query: {
                          orderByChild: 'position',
                          limitToFirst: this.limit
                        }
                      });
      }

      this.items.subscribe(
        result => { this.itemsArray=result; }
      );
      
      if(infiniteScroll) {
        this.items.subscribe(
          result => infiniteScroll.complete()
        );
      }

      this.limit *= 2;
  }

  itemTapped(event, item) {
    this.presentActionSheet(item);
  }

  itemPressed(event, item) {
    this.markAsUrgent(item);
  }

  itemTest(event) {
    console.log(JSON.stringify(event));
  }

  presentActionSheet(item) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ações',
      buttons: [
        {
          text: 'Visualizar Tarefa',
          icon: 'search',
          handler: () => {
            let modal = this.modalCtrl.create(ShowTaskPage, {
              item: item
            });
            modal.present();
            modal.onDidDismiss(params => {
              console.log(JSON.stringify(params));
              if(params && params.markAsCompleted){
                this.markAsCompleted(item);
              }
            });
          }
        },
        {
          text: 'Marcar como urgente',
          icon: 'warning',
          handler: () => {
            this.markAsUrgent(item);
          }
        },
        {
          text: 'Marcar como feita',
          icon: 'archive',
          handler: () => {
            this.markAsCompleted(item);
          }
        },
        {
          text: 'Marcar como nao feita',
          icon: 'archive',
          handler: () => {
            this.markAsNotCompleted(item);
          }
        },
        {
          text: 'Editar',
          icon: 'document',
          handler: () => {
            let modal = this.modalCtrl.create(EditTaskPage, {
              item: item
            });
            modal.present();
            modal.onDidDismiss(params => {
              console.log(JSON.stringify(params));
             this.editarTarefa(item, params.nome, params.urgent, params.feita);
            });
          }
        },
        {
          text: 'Apagar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.delete(item);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  getDate(milis: string) {
    return (new Date(milis)).toLocaleDateString();
  }

  markAsCompleted(item) {
    this.items.update(item, {completed: true});
    this.items.update(item, {not_completed: false});
  }
  
    markAsNotCompleted(item) {
    this.items.update(item, {not_completed: true});
    this.items.update(item, {completed: false});
  }

  markAsUrgent(item) {
    this.items.update(item, {urgent: true});
  }
  
  editarTarefa(item, txtNote, urgente, completed) {
    console.log("Urgente "+urgente);
    console.log("Completed "+completed);
    this.items.update(item, {note: txtNote, urgent: urgente, completed: completed});
    console.log("Items: "+this.items);
  }

  delete(item) {
    this.items.remove(item);
  }

  reorderItems(indexes){
      let orderedItems = reorderArray(this.itemsArray, indexes);
      for(let i = 0; i < orderedItems.length; i++){
        this.setPosition(orderedItems[i], i);
      }
  }

  setPosition(item, position) {
    this.items.update(item, {position: position});
  }

}
