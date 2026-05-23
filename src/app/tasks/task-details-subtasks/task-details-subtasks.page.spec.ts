import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsSubtasksPage } from './task-details-subtasks.page';

describe('TaskDetailsSubtasksPage', () => {
  let component: TaskDetailsSubtasksPage;
  let fixture: ComponentFixture<TaskDetailsSubtasksPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsSubtasksPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
