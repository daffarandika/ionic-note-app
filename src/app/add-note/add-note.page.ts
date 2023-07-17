import { Component, OnInit } from '@angular/core';
import { NoteColor } from '../data/noteColor';
import { DatabaseService } from '../services/database.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.page.html',
  styleUrls: ['./add-note.page.scss'],
})
export class AddNotePage implements OnInit {

  selected: NoteColor = "orange";
  title = "";
  content = "";

  constructor(
    private databaseService: DatabaseService,
    private navController: NavController,
  ) {
  }

  ngOnInit() {
                                           
  }

  changeSelected(selected: NoteColor) {
    this.selected = selected;
  }

  async addNote() {
    console.log(`>> inserting ${this.title} ${this.content}`)
    this.databaseService.addNote(this.title, this.content, this.selected).then((notes) => {
      this.navController.navigateBack("/home", {state: notes} );
    });
  }

}
