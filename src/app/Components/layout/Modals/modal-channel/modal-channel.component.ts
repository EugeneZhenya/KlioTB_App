import { Component, OnInit, Inject } from '@angular/core';
import { DatePipe, formatDate } from '@angular/common';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/Interfaces/category';
import { Country } from 'src/app/Interfaces/country';
import { Channel } from 'src/app/Interfaces/channel';

import { CategoryService } from 'src/app/Services/category.service';
import { CountryService } from 'src/app/Services/country.service';
import { ChannelService } from 'src/app/Services/channel.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';
import { FileUploadService } from 'src/app/Services/file-upload.service';

@Component({
  selector: 'app-modal-channel',
  templateUrl: './modal-channel.component.html',
  styleUrls: ['./modal-channel.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: DatePipe}
  ],
})
export class ModalChannelComponent implements OnInit {
  private urlApi: string = environment.endPoint;
  formChannel: FormGroup;
  actionTitle: string = "Додати";
  buttonAction: string = "Створити";
  listCategories: Category[] = [];
  listCountries: Country[] = [];

  selectedFiles?: FileList;
  selectedFileNames: string[] = [];
  previews: string[] = [];
  progressInfos: any[] = [];
  imageInfos?: Observable<any>;
  message: string[] = [];
  dateFormat: string = "dd.MM.yyyy";

  constructor(
    private modalActual: MatDialogRef<ModalChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public dataChannel: Channel,
    private fb: FormBuilder,
    private _categoryService: CategoryService,
    private _countryService: CountryService,
    private _channelService: ChannelService,
    private _utilService: UtlitasService,
    private _uploadService: FileUploadService,
    private datepipe: DatePipe
  ) {
    this.formChannel = this.fb.group({
      name: ['', Validators.required],
      strKey: ['', Validators.required],
      description: ['', Validators.required],
      logoUrl: [''],
      startTime: ['00:00'],
      endTime: ['00:00'],
      broadcastFrom: [undefined],
      startAge: 0,
      websiteUrl: [''],
      timeShit: ['00:00'],
      categoryId: [0],
      categoryDescription: [''],
      countryId: [0],
      countryDescription: [''],
    });

    if (this.dataChannel != null) {
      this.actionTitle = "Змінити";
      this.buttonAction = "Зберегти";
    }

    this._categoryService.list().subscribe({
      next: (data) => {
        if (data.status) {
          this.listCategories = data.value
          this.listCategories = this.listCategories.sort((a, b) => (a.name < b.name ? -1 : 1));
        }
      },
      error: (e) => {}
    })

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

  getLocalDate(strDate: string)
  {
    if (strDate != null)
    {
      const allParts = strDate.split(' ');
      const parts = allParts[0].split('.');
      const mydate = new Date(parts[2]+"/"+parts[1]+"/"+parts[0]);
      console.log(parts, mydate);
      // return this.datepipe.transform(mydate, this.dateFormat, undefined, 'uk');
      return mydate;
    } else {
      return null
    }
  }

  ngOnInit(): void {
    if (this.dataChannel != null) {
      this.formChannel.patchValue({
        name: this.dataChannel.name,
        strKey: this.dataChannel.strKey,
        description: this.dataChannel.description,
        logoUrl: this.dataChannel.logoUrl,
        startTime: this.dataChannel.startTime,
        endTime: this.dataChannel.endTime,
        broadcastFrom: this.getLocalDate(this.dataChannel.broadcastFrom),
        startAge: this.dataChannel.startAge,
        websiteUrl: this.dataChannel.websiteUrl,
        timeShit: this.dataChannel.timeShit,
        categoryId: this.dataChannel.categoryId,
        categoryDescription: this.dataChannel.categoryDescription,
        countryId: this.dataChannel.countryId,
        countryDescription: this.dataChannel.countryDescription
      });
      this.previews.push(this.urlApi + "/" + this.dataChannel.logoUrl);
    }
  }

  getFlagUrl(url: string)
  {
    return this.urlApi + "/" + url;
  }

  selectFiles(event: any): void {
    this.message = [];
    this.progressInfos = [];
    this.selectedFileNames = [];
    this.selectedFiles = event.target.files;

    this.previews = [];
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          console.log(e.target.result);
          this.previews = [];
          this.previews.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFiles[i]);

        this.selectedFileNames.push(this.selectedFiles[i].name);
        this.formChannel.patchValue({
          logoUrl: this.selectedFiles[i].name
        })
      }
    }
  }

  uploadFiles(): void {
    this.message = [];

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }

  upload(idx: number, file: File): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };

    if (file) {
      this._uploadService.upload(file).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Зображення збережено", "Зроблено");
            this.previews = [];
            this.previews.push(this.urlApi + "/" + data.value);
            this.formChannel.patchValue({
              logoUrl: data.value
            })
          } else {
            this._utilService.showAlert("Неможливо зберегти зображення", "Помилка");
          }
        },
        error: (e) => {}
      });
    }
  }

  saveChannel() {
    console.log(this.formChannel.value);
    var resDate = '';
    if (this.formChannel.value.broadcastFrom != null) {
      const dateString = new Date(this.formChannel.value.broadcastFrom._d.toString());
      const tranformed = this.datepipe.transform(dateString, this.dateFormat, undefined, 'uk');
      resDate = tranformed != null ? tranformed : '';
    }
    // console.log(_moment(dateString).format('Z'));
    // return;
    
    const _channel: Channel = {
      id: this.dataChannel == null ? 0 : this.dataChannel.id,
      name: this.formChannel.value.name,
      strKey: this.formChannel.value.strKey,
      description: this.formChannel.value.description,
      logoUrl: this.formChannel.value.logoUrl,
      startTime: this.formChannel.value.startTime,
      endTime: this.formChannel.value.endTime,
      broadcastFrom: resDate,
      startAge: this.formChannel.value.startAge,
      websiteUrl: this.formChannel.value.websiteUrl,
      categoryId: this.formChannel.value.categoryId,
      categoryDescription: '',
      countryId: this.formChannel.value.countryId,
      countryDescription: '',
      timeShit: this.formChannel.value.timeShit,
      channelBroadcasts: [],
      programmes: [],
      videoStreams: []
    }

    if (this.dataChannel == null) {
      this._channelService.create(_channel).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Канал додано", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося додати канал", "Помилка");
          }
        },
        error: (e) => {}
      })
    } else {
      this._channelService.edit(_channel).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Канал збережено", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося зберегти канал", "Помилка");
          }
        },
        error: (e) => {}
      })
    }
  }

}
