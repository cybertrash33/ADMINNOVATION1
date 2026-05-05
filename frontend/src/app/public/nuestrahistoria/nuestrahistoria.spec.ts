import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nuestrahistoria } from './nuestrahistoria';

describe('Nuestrahistoria', () => {
  let component: Nuestrahistoria;
  let fixture: ComponentFixture<Nuestrahistoria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nuestrahistoria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nuestrahistoria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
