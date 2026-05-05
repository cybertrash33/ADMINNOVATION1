import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Equipodirectivo } from './equipodirectivo';

describe('Equipodirectivo', () => {
  let component: Equipodirectivo;
  let fixture: ComponentFixture<Equipodirectivo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Equipodirectivo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Equipodirectivo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
