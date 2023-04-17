import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from './app/app.module';
import {useGeographic} from "ol/proj";

// use lon/lat
useGeographic();

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
