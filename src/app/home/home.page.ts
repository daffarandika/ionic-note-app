import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AlertController } from '@ionic/angular';
import { Note } from '../data/note';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)', opacity: 1 }),
        animate('500ms', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ]
    )
  ]
})
export class HomePage implements OnInit {

  showSort: boolean = false;
  title: string = "";
  notes: Note[] = [];
  constructor(
    private databaseService: DatabaseService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.databaseService.getNotes().subscribe( async (val) => {
      const alert = await this.alertController.create({
        message: "NOtes: " + JSON.stringify(val)
      })
      await alert.present();
      this.notes = val.values as Note[];
    })
  }

  sortIconClicked() {
    this.showSort = !this.showSort;
  }
}
