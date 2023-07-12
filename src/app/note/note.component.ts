import { Component, Input, OnInit } from '@angular/core';
import { NoteColor } from '../data/noteColor';

@Component({
  selector: 'note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})

export class NoteComponent  implements OnInit {

  @Input() title: string = "Title";
  @Input() content: string= "Content";
  @Input() color: NoteColor = "orange";
  constructor() { }

  ngOnInit() {}

}
