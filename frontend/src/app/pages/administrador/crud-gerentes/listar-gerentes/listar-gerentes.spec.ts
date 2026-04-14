import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarGerentes } from './listar-gerentes';

describe('ListarGerentes', () => {
  let component: ListarGerentes;
  let fixture: ComponentFixture<ListarGerentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarGerentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarGerentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
