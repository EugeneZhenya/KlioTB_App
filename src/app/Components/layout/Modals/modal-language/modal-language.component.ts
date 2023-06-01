import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Country } from 'src/app/Interfaces/country';
import { Language } from 'src/app/Interfaces/language';

import { CountryService } from 'src/app/Services/country.service';
import { LanguageService } from 'src/app/Services/language.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-language',
  templateUrl: './modal-language.component.html',
  styleUrls: ['./modal-language.component.css']
})
export class ModalLanguageComponent implements OnInit {
  private urlApi: string = environment.endPoint;
  formLang: FormGroup;
  actionTitle: string = "Додати";
  buttonAction: string = "Створити";
  listCountries: Country[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalLanguageComponent>,
    @Inject(MAT_DIALOG_DATA) public dataLang: Language,
    private fb: FormBuilder,
    private _countryService: CountryService,
    private _languageService: LanguageService,
    private _utilService: UtlitasService
  ) {
    this.formLang = this.fb.group({
      name: ['', Validators.required],
      flag: ['', Validators.required],
      code2: [''],
      code3: [''],
      countryId: [0]
    });

    if (this.dataLang != null) {
      this.actionTitle = "Змінити";
      this.buttonAction = "Зберегти";
    }

    this._countryService.list().subscribe({
      next: (data) => {
        if (data.status) {
          this.listCountries = data.value
          this.listCountries = this.listCountries.sort((a, b) => (a.name < b.name ? -1 : 1));
        }
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    if (this.dataLang != null) {
      this.formLang.patchValue({
        name: this.dataLang.name,
        flag: this.dataLang.flag,
        code2: this.dataLang.code2,
        code3: this.dataLang.code3,
        countryId: this.dataLang.countryId
      })
    }
  }

  getFlagUrl(url: string)
  {
    return this.urlApi + "/" + url;
  }

  saveLanguage() {
    console.log(this.dataLang);
    
    const _lang: Language = {
      id: this.dataLang == null ? 0 : this.dataLang.id,
      name: this.formLang.value.name,
      flag: this.formLang.value.flag,
      countryId: this.formLang.value.countryId,
      countryDescription: "",
      countryCode: "",
      code2: this.formLang.value.code2,
      code3: this.formLang.value.code3
    }

    if (this.dataLang == null) {
      this._languageService.create(_lang).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Мову додано", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося додати мову", "Помилка");
          }
        },
        error: (e) => {}
      })
    } else {
      this._languageService.edit(_lang).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Мову збережено", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося зберегти мову", "Помилка");
          }
        },
        error: (e) => {}
      })
    }
  }

}
