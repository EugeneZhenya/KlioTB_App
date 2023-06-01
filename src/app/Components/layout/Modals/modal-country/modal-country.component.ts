import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Country } from 'src/app/Interfaces/country';
import { CountryService } from 'src/app/Services/country.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';

@Component({
  selector: 'app-modal-country',
  templateUrl: './modal-country.component.html',
  styleUrls: ['./modal-country.component.css']
})
export class ModalCountryComponent implements OnInit {
  formCountry: FormGroup;
  actionTitle: string = "Додати";
  buttonAction: string = "Створити";

  constructor(
    private modalActual: MatDialogRef<ModalCountryComponent>,
    @Inject(MAT_DIALOG_DATA) public dataCountry: Country,
    private fb: FormBuilder,
    private _countryService: CountryService,
    private _utilService: UtlitasService
  ) {
    this.formCountry = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      flagUrl: ['', Validators.required],
      coatArmsUrl: ['', Validators.required],
      currency: [''],
      isoNum: [''],
      isoAlpha3: [''],
      isoAlpha2: [''],
      domain: [''],
      phoneCode: ['']
    });

    if (this.dataCountry != null) {
      this.actionTitle = "Змінити";
      this.buttonAction = "Зберегти";
    }
  }

  ngOnInit(): void {
    if (this.dataCountry != null) {
      this.formCountry.patchValue({
        name: this.dataCountry.name,
        description: this.dataCountry.description,
        flagUrl: this.dataCountry.flagUrl,
        coatArmsUrl: this.dataCountry.coatArmsUrl,
        currency: this.dataCountry.currency,
        isoNum: this.dataCountry.isoNum,
        isoAlpha3: this.dataCountry.isoAlpha3,
        isoAlpha2: this.dataCountry.isoAlpha2,
        domain: this.dataCountry.domain,
        phoneCode: this.dataCountry.phoneCode
      })
    }
  }

  saveCountry() {
    const _country: Country = {
      id: this.dataCountry == null ? 0 : this.dataCountry.id,
      name: this.formCountry.value.name,
      description: this.formCountry.value.description,
      flagUrl: this.formCountry.value.flagUrl,
      coatArmsUrl: this.formCountry.value.coatArmsUrl,
      currency: this.formCountry.value.currency,
      isoNum: this.formCountry.value.isoNum,
      isoAlpha3: this.formCountry.value.isoAlpha3,
      isoAlpha2: this.formCountry.value.isoAlpha2,
      domain: this.formCountry.value.domain,
      phoneCode: this.formCountry.value.phoneCode,
      channels: [],
      languages: [],
      channelBroadcasts: []
    }

    if (this.dataCountry == null) {
      this._countryService.create(_country).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Країну додано", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося додати країну", "Помилка");
          }
        },
        error: (e) => {}
      })
    } else {
      this._countryService.edit(_country).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Країну збережено", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося зберегти країну", "Помилка");
          }
        },
        error: (e) => {}
      })
    }
  }

}
