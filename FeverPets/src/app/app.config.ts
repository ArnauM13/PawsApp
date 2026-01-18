import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom, inject } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import {provideHttpClient} from "@angular/common/http";

import {provideTranslateService} from "@ngx-translate/core";
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

// Recuperar idioma de localStorage o usar 'en' per defecte
const getInitialLang = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedLang = localStorage.getItem('lang');
    if (savedLang && ['en', 'es', 'ca'].includes(savedLang)) {
      return savedLang;
    }
  }
  return 'en';
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideTranslateService({
      lang: getInitialLang(),
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
          prefix: '/i18n/',
          suffix: '.json',
        })
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false,
        },
      },
    }),
  ]
};
