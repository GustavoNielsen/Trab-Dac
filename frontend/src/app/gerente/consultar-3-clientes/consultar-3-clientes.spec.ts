import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Consultar3Clientes } from './consultar-3-clientes';

describe('Consultar3Clientes', () => {
  let component: Consultar3Clientes;
  let fixture: ComponentFixture<Consultar3Clientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Consultar3Clientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Consultar3Clientes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
