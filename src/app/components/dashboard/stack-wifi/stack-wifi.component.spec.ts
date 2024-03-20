import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackWIFIComponent } from './stack-wifi.component';

describe('StackWIFIComponent', () => {
  let component: StackWIFIComponent;
  let fixture: ComponentFixture<StackWIFIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackWIFIComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StackWIFIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
