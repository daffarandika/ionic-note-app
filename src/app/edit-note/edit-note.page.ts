import { Component, OnInit } from '@angular/core';
import { NoteColor } from '../data/noteColor';
import { DatabaseService } from '../services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from '../data/note';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.page.html',
  styleUrls: ['./edit-note.page.scss'],
})
export class EditNotePage implements OnInit {

  selected: NoteColor = "orange";
  id = -1;
  title = "";
  content = "";
  note = {} as Note;

  constructor(
    private databaseService: DatabaseService,
    private router: Router,
    private aRoute: ActivatedRoute
  ) {
    this.id = Number(this.aRoute.snapshot.paramMap.get('id'));
    this.databaseService.getNoteById(this.id).then((val) => {
      this.note = val as Note;
      this.title = this.note.title;
      this.content = this.note.content;
      this.selected = this.note.color;
    })
  }

  ngOnInit() {
                                           
  }

  changeSelected(selected: NoteColor) {
    this.selected = selected;
  }

  async editNote() {
    console.log(`>> inserting ${this.title} ${this.content}`)
    const note = {
      id: this.note.id,
      title: this.title,
      color: this.selected,
      content: this.content,
    } as Note;
    this.databaseService.editNote(note).then(() => {
      this.router.navigateByUrl('/home');
    });
  }


}
