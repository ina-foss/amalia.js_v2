import {async} from '@angular/core/testing';
import {PlayerPlugin} from './player-plugin';


describe('Plugin', () => {
  let component: PlayerPlugin;
  beforeEach(async(() => {
    component = new PlayerPlugin();
  }));

  beforeEach(() => {
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
