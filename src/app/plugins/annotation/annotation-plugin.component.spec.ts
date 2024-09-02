import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationPluginComponent } from './annotation-plugin.component';

describe('AnnotationPluginComponent', () => {
  let component: AnnotationPluginComponent;
  let fixture: ComponentFixture<AnnotationPluginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnnotationPluginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationPluginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
