import { Component, inject, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'fp-language-dropdown',
  standalone: true,
  imports: [SelectModule, FormsModule],
  template: `
    <p-select
      [(ngModel)]="currentLang"
      [options]="languages"
      optionLabel="label"
      optionValue="value"
      (onChange)="changeLang($event.value)"
      ariaLabel="Language selector" />
  `,
})
export class LanguageDropdownComponent implements OnInit {
  protected readonly translate = inject(TranslateService);

  languages = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' },
    { label: 'Català', value: 'ca' }
  ];

  currentLang: string = 'en';

  ngOnInit() {
    this.currentLang = this.translate.currentLang ?? this.currentLang;
  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }
}
