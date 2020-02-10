import {async} from '@angular/core/testing';
import {PluginBase} from './plugin-base';

describe('Plugin', () => {
  let component: PluginBase;
  beforeEach(async(() => {
    component = new PluginBase();
  }));

  beforeEach(() => {
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
