import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InserirGerentes } from './inserir-gerentes';

describe('InserirGerentes', () => {
  let component: InserirGerentes;
  let fixture: ComponentFixture<InserirGerentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InserirGerentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InserirGerentes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
