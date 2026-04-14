import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarGerentes } from './editar-gerentes';

describe('EditarGerentes', () => {
  let component: EditarGerentes;
  let fixture: ComponentFixture<EditarGerentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarGerentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarGerentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
