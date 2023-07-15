import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { AlertController } from '@ionic/angular';
import { Note } from '../data/note';
import { Router } from '@angular/router';

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
    private router: Router,
  ) {
    this.databaseService.getNotes().subscribe( async (val) => {
      this.notes = val.values as Note[];
    })
   }

  ngOnInit() {
  }

  sortIconClicked() {
    this.showSort = !this.showSort;
  }

  addNote() {
    this.router.navigateByUrl('/add-note');
    this.databaseService.getNotes().subscribe((val) => {
      this.notes = val.values as Note[];
    })
  }
}
