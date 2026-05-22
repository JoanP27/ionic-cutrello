import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsParticipantsPage } from './task-details-participants.page';

describe('TaskDetailsParticipantsPage', () => {
  let component: TaskDetailsParticipantsPage;
  let fixture: ComponentFixture<TaskDetailsParticipantsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsParticipantsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
