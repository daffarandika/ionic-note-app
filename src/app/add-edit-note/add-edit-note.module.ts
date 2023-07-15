import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditNotePageRoutingModule } from './add-edit-note-routing.module';

import { AddEditNotePage } from './add-edit-note.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditNotePageRoutingModule
  ],
  declarations: [AddEditNotePage]
})
export class AddEditNotePageModule {}
