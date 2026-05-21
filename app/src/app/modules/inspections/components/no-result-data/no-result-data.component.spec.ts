import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultDataComponent } from './no-result-data.component';

describe('NoResultDataComponent', () => {
  let component: NoResultDataComponent;
  let fixture: ComponentFixture<NoResultDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoResultDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoResultDataComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
