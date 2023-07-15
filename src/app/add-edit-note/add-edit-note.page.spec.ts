import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditNotePage } from './add-edit-note.page';

describe('AddEditNotePage', () => {
  let component: AddEditNotePage;
  let fixture: ComponentFixture<AddEditNotePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddEditNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
