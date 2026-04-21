import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDetailsInfoPage } from './task-details-info.page';

describe('TaskDetailsInfoPage', () => {
  let component: TaskDetailsInfoPage;
  let fixture: ComponentFixture<TaskDetailsInfoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailsInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
