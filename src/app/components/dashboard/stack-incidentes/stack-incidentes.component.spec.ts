import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StackIncidentesComponent } from './stack-incidentes.component';

describe('StackIncidentesComponent', () => {
  let component: StackIncidentesComponent;
  let fixture: ComponentFixture<StackIncidentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StackIncidentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StackIncidentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
