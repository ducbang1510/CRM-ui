import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderFilterGroupDialogComponent } from './sales-order-filter-group-dialog.component';

describe('SalesOrderFilterGroupDialogComponent', () => {
  let component: SalesOrderFilterGroupDialogComponent;
  let fixture: ComponentFixture<SalesOrderFilterGroupDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesOrderFilterGroupDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderFilterGroupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
