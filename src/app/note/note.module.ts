import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note.component';



@NgModule({
  declarations: [NoteComponent],
  imports: [
    CommonModule
  ],
  exports: [NoteComponent]
})
export class NoteModule { }
