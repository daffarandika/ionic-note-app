import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NoteColor } from '../data/noteColor';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})

export class NoteComponent  implements OnInit {

  @Input() title: string = "Title";
  @Input() content: string= "Content";
  @Input() color: NoteColor = "pink";
  @Input() note_id: number = -1;
  @Output() deleteClicked = new EventEmitter<number>();
  @Output() noteClicked = new EventEmitter<number>();
  constructor() { }

  ngOnInit() {}

  deleteNote(ev: Event) {
    ev.stopPropagation();
    this.deleteClicked.emit(this.note_id);
  }

  getNoteById() {
    this.noteClicked.emit(this.note_id);
  }

}
