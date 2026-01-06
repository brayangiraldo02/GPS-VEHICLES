import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchHeaderComponent } from './search-header.component';

describe('SearchHeaderComponent', () => {
  let component: SearchHeaderComponent;
  let fixture: ComponentFixture<SearchHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
