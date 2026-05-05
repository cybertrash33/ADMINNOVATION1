import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Valorescorporativos } from './valorescorporativos';

describe('Valorescorporativos', () => {
  let component: Valorescorporativos;
  let fixture: ComponentFixture<Valorescorporativos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Valorescorporativos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Valorescorporativos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
