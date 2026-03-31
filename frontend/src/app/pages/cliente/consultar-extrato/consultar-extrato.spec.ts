import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarExtrato } from './consultar-extrato';

describe('ConsultarExtrato', () => {
  let component: ConsultarExtrato;
  let fixture: ComponentFixture<ConsultarExtrato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarExtrato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarExtrato);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
