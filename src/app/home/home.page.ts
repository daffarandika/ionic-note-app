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
  sortBy: string = "date";
  sortOrder: string = "asc";
  notes: Note[] = [];
  constructor(
    private databaseService: DatabaseService,
    private router: Router,
  ) {
    console.log('home constructor called');
  }

  ngOnInit() {
    console.log('home oninit called');
    this.loadNotes();
  }

  sortIconClicked() {
    this.showSort = !this.showSort;
  }

  addNote() {
    this.router.navigateByUrl('/add-note').then(() => {
      this.loadNotes();
    })
  }
  
  loadNotes() {
    console.log('>> load notes called');
    this.databaseService.getNotes().subscribe((val) => {
      this.notes = val.values as Note[];
      console.log(`>> notes from val: ${JSON.stringify(val)}`);
      console.log(`>> notes from load notes: ${JSON.stringify(this.notes)}`);
    })
    this.sortByChanged();
  }

  editNote(id: number) {
    this.router.navigateByUrl(`/edit-note/${id}`).then(() => {
      this.loadNotes();
    });
  }


  sortByChanged() {
    console.log(`>> model sort by changed ${JSON.stringify(this.sortBy)}`);
    switch (this.sortBy) {
      case "title" : {
        (this.sortOrder === "asc") 
          ? this.notes.sort( (a: Note, b: Note) => a.title.localeCompare(b.title) ) 
          : this.notes.sort( (a: Note, b: Note) => b.title.localeCompare(a.title) );
        break;
      }

      case "color" : {
        (this.sortOrder === "asc") 
          ? this.notes.sort( (a: Note, b: Note) => a.color.localeCompare(b.color) ) 
          : this.notes.sort( (a: Note, b: Note) => b.color.localeCompare(a.color) );
        break;
      }

      default : {
        (this.sortOrder === "asc") 
          ? this.notes.sort( (a: Note, b: Note) => a.timestamp - b.timestamp ) 
          : this.notes.sort( (a: Note, b: Note) => b.timestamp - a.timestamp );
        break;
      }
    }
  }

  async deleteNote(id: number) {
    this.databaseService.deleteNoteById(id).then(() => {
      this.loadNotes();
    })
  }

  async getNoteById(id: number) {
    this.router.navigateByUrl(`/edit-note/${id}`).then(() => {
      this.loadNotes();
    })
  }
}
