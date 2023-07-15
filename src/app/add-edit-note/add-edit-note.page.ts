import { Component, OnInit } from '@angular/core';
import { NoteColor } from '../data/noteColor';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-note',
  templateUrl: './add-edit-note.page.html',
  styleUrls: ['./add-edit-note.page.scss'],
})
export class AddEditNotePage implements OnInit {

  selected: NoteColor = "orange";
  title = "";
  content = "";

  constructor(
    private databaseService: DatabaseService,
    private router: Router
  ) {
  }

  ngOnInit() {
    // await this.databaseService.setupDB()
  }

  changeSelected(selected: NoteColor) {
    this.selected = selected;
  }

  async addNote() {
    console.log(`>> inserting ${this.title} ${this.content}`)
    await this.databaseService.addNote(this.title, this.content, this.selected);
    this.router.navigateByUrl('/home');
  }

}
