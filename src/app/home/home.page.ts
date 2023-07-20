import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';
import { Note } from '../data/note';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchbarCustomEvent } from '@ionic/angular';

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
  isSearch: boolean = false;
  searchQuery: string = "";
  notes: Note[] = [];
  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {
    console.log('home constructor called');
    aRoute.params.forEach(() => {
      this.loadNotes();
    })
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
  
  loadNotes(notes?: Note[]) {
    console.log('>> load notes called');
    if (notes) {
      this.notes = notes;
    }
    this.databaseService.getNotes().subscribe((val) => {
      this.notes = val.values as Note[];
      console.log(`>> notes from val: ${JSON.stringify(val)}`);
      console.log(`>> notes from load notes: ${JSON.stringify(this.notes)}`);
      this.sortByChanged();
    })
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

  showSearch() {
    this.isSearch = true;
  }

  onSearchChange(ev: Event) {
    let query = (ev as SearchbarCustomEvent).target.value ?? "";
    if (query.length === 0) {
      this.loadNotes();
      return;
    }
    query = query.toLowerCase()
    this.notes = this.notes.filter((note) => 
      note.content.toLowerCase().indexOf(query) > -1 ||
      note.title.toLowerCase().indexOf(query) > -1
    )
  }

  hideSearch() {
    this.isSearch = false;
  }
}
