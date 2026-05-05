import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Paginausuario } from './paginausuario';

describe('Paginausuario', () => {
  let component: Paginausuario;
  let fixture: ComponentFixture<Paginausuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paginausuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Paginausuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
