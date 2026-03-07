import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoCadastro } from './auto-cadastro';

describe('AutoCadastro', () => {
  let component: AutoCadastro;
  let fixture: ComponentFixture<AutoCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
