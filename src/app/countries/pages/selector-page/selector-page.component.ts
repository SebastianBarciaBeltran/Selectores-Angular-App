import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { Country, CountrySmall } from '../../interfaces/countries.interfaces';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: ['./selector-page.component.css'],
})
export class SelectorPageComponent implements OnInit {
  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  regions: string[] = [];
  countriesByRegion: CountrySmall[] = [];
  borders: string[] = [];

  // UI
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _countryService: CountryService
  ) {}

  ngOnInit(): void {
    this.regions = this._countryService.regions;
    this.getCountriesByRegion();
  }

  getCountriesByRegion(): void {
    this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.myForm.get('country')?.reset('');
          this.loading = true;
        }),
        switchMap((region) => this._countryService.getCountriesByRegion(region))
      )
      .subscribe((countriesByRegion) => {
        this.countriesByRegion = countriesByRegion;
        this.loading = false;
        this.getBordersByRegionAndCountry();
      });
  }

  getBordersByRegionAndCountry(): void {
    this.myForm
      .get('country')
      ?.valueChanges.pipe(
        tap((_) => {
          this.myForm.get('border')?.reset('');
          this.loading = true;
        }),
        switchMap((countryCode) =>
          this._countryService.getCountryByCountryCode(countryCode)
        )
      )
      .subscribe((country) => {
        this.borders = country?.borders || [];
        this.loading = false;
      });
  }

  save() {}
}
