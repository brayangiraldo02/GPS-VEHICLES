import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInspectionsComponent } from './table-inspections.component';

describe('TableInspectionsComponent', () => {
  let component: TableInspectionsComponent;
  let fixture: ComponentFixture<TableInspectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableInspectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableInspectionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
