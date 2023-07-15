import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteComponent } from './note.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [NoteComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [NoteComponent]
})
export class NoteModule { }
