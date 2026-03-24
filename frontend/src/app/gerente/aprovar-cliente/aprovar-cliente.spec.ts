import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovarCliente } from './aprovar-cliente';

describe('AprovarCliente', () => {
  let component: AprovarCliente;
  let fixture: ComponentFixture<AprovarCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovarCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AprovarCliente);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
