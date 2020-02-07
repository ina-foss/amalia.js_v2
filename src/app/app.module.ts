import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import {AmaliaComponent} from './player/amalia.component';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  declarations: [AmaliaComponent],
  entryComponents: [AmaliaComponent],
  providers: [],
  bootstrap: []
})
export class AppModule {
  private readonly injector: Injector;

  constructor(injector: Injector) {
    this.injector = injector;
  }

  ngDoBootstrap() {
    const customElementAmalia = createCustomElement(AmaliaComponent, {injector: this.injector});
    customElements.define('amalia-player', customElementAmalia);
  }
}
