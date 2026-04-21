import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsCommentsPage } from './task-details-comments.page';

describe('TaskDetailsCommentsPage', () => {
  let component: TaskDetailsCommentsPage;
  let fixture: ComponentFixture<TaskDetailsCommentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
