import { PreventCtrlScrollDirective } from './prevent-ctrl-scroll.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<div appPreventCtrlScroll>Test Content</div>`
})
class TestComponent {}

describe('PreventCtrlScrollDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, PreventCtrlScrollDirective]
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should prevent default behavior on Ctrl + Scroll', () => {
    const divElement = fixture.debugElement.query(By.directive(PreventCtrlScrollDirective));
    const event = new WheelEvent('wheel', { ctrlKey: true });

    spyOn(event, 'preventDefault');

    divElement.triggerEventHandler('wheel', event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});