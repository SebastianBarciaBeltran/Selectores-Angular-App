import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country, CountrySmall } from '../interfaces/countries.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private _base_url: string = 'https://restcountries.com/v2';

  private _regions: string[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
  ];

  get regions(): string[] {
    return [...this._regions];
  }

  constructor(private _http: HttpClient) {}

  getCountriesByRegion(region: string): Observable<CountrySmall[]> {
    const url: string = `${this._base_url}/region/${region}?fields=alpha3Code,name`;
    return this._http.get<CountrySmall[]>(url);
  }

  getCountryByCountryCode(countryCode: string): Observable<Country | null> {
    if (!countryCode) {
      return of(null);
    }

    const url: string = `${this._base_url}/alpha/${countryCode}`;
    return this._http.get<Country>(url);
  }
}
