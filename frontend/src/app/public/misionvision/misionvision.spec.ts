import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Misionvision } from './misionvision';

describe('Misionvision', () => {
  let component: Misionvision;
  let fixture: ComponentFixture<Misionvision>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Misionvision]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Misionvision);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
