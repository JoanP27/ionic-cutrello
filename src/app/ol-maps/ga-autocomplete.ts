import { afterNextRender, Directive, ElementRef, inject, output } from '@angular/core';
import { GeocoderAutocomplete } from '@geoapify/geocoder-autocomplete';
import { SearchResult } from './search-result';

@Directive({
  selector: '[gaAutocomplete]',
  host: {
    style: `
      z-index: 1;
      display: block;
      position: absolute;
      top: 20px;
      right: 20px;
      width: 50%;
      background-color: white;
      color: black
    `,
  },
})
export class GaAutocomplete {
  #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  #autoComplete!: GeocoderAutocomplete;
  locationChange = output<SearchResult>();

  constructor() {
    afterNextRender(() => {
      this.#autoComplete = new GeocoderAutocomplete(
        this.#elementRef.nativeElement,
        'd14c6169904c48bd9a41604f7192c991',
        { lang: 'es', debounceDelay: 600, skipIcons: true,type: 'city' },
      );

      this.#autoComplete.on('select', (location) => {
        this.locationChange.emit({
          coordinates: location.geometry.coordinates,
          address: location.properties.formatted,
        });
      });
    });
  }
}
