import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditNotePage } from './add-edit-note.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditNotePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditNotePageRoutingModule {}
