import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input, TemplateRef } from '@angular/core';
import { CardModule } from 'primeng/card';

/**
 * Component to display a card.
 *
 * @param style - The style to apply to the card
 * @param contentTemplate - The template to use for the content
 * @param headerTemplate - The template to use for the header
 * @param titleTemplate - The template to use for the title
 * @param subtitleTemplate - The template to use for the subtitle
 * @param footerTemplate - The template to use for the footer
 * @returns The card component
 */
@Component({
  selector: 'pa-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, NgTemplateOutlet],
  template: `
    <p-card [style]="style()">

      <ng-template #header>
        @if (headerTemplate) {
          <ng-container *ngTemplateOutlet="headerTemplate; context: { $implicit: header }" />
        }
      </ng-template>

      <ng-template #title let-title>
        @if (titleTemplate) {
          <ng-container *ngTemplateOutlet="titleTemplate; context: { $implicit: title }" />
        }
      </ng-template>

      <ng-template #subtitle let-subtitle>
        @if (subtitleTemplate) {
          <ng-container *ngTemplateOutlet="subtitleTemplate; context: { $implicit: subtitle }" />
        }
      </ng-template>

      <ng-template #content let-content>
        <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: content }" />
      </ng-template>

      <ng-template #footer let-footer>
        @if (footerTemplate) {
          <ng-container *ngTemplateOutlet="footerTemplate; context: { $implicit: footer }" />
        }
      </ng-template>
    </p-card>
  `
})
export class CardComponent {
  style = input<{ [key: string]: any } | undefined>(undefined);

  @Input({required: true}) contentTemplate!: TemplateRef<any>;

  @Input() headerTemplate?: TemplateRef<any>;
  @Input() titleTemplate?: TemplateRef<any>;
  @Input() subtitleTemplate?: TemplateRef<any>;
  @Input() footerTemplate?: TemplateRef<any>;
}
