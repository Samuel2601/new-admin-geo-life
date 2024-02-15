import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatepwComponent } from './updatepw.component';

describe('UpdatepwComponent', () => {
  let component: UpdatepwComponent;
  let fixture: ComponentFixture<UpdatepwComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatepwComponent]
    });
    fixture = TestBed.createComponent(UpdatepwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
