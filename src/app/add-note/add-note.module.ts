import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditNotePageRoutingModule } from './add-note-routing.module';

import { AddNotePage } from './add-note.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditNotePageRoutingModule
  ],
  declarations: [AddNotePage]
})
export class AddEditNotePageModule {}
