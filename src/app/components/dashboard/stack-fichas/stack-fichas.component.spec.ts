import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackFichasComponent } from './stack-fichas.component';

describe('StackFichasComponent', () => {
  let component: StackFichasComponent;
  let fixture: ComponentFixture<StackFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackFichasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StackFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
