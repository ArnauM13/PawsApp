import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { APP_CONFIG } from '@core/config';

/**
 * Directive to handle image loading errors and show a fallback image.
 * When an image fails to load, it will automatically replace the src with the fallback image.
 *
 * @example
 * <img [src]="pet.photo_url" [fpImageFallback]="APP_CONFIG.logoPath" [alt]="pet.name" />
 */
@Directive({
  selector: '[fpImageFallback]'
})
export class ImageFallbackDirective {
  @Input() fpImageFallback: string = APP_CONFIG.logoPath;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    if (img.src !== this.fpImageFallback) {
      img.src = this.fpImageFallback;
    }
  }
}
