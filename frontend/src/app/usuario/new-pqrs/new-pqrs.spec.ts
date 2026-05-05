import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPqrs } from './new-pqrs';

describe('NewPqrs', () => {
  let component: NewPqrs;
  let fixture: ComponentFixture<NewPqrs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPqrs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPqrs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
