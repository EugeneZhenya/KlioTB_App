import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort,Sort } from '@angular/material/sort';

import { environment } from 'src/environments/environment';
import { ModalLanguageComponent } from '../../Modals/modal-language/modal-language.component';
import { Language } from 'src/app/Interfaces/language';
import { LanguageService } from 'src/app/Services/language.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit, AfterViewInit {
  public backendUrl: string = environment.endPoint;
  columnsTable: string[] = ['id', 'name', 'flag', 'code2', 'code3', 'country', 'actions'];
  columnsWithObject: string[] = ['id', 'name', 'code2', 'code3'];
  dataInit: Language[] = [];
  dataLangsList = new MatTableDataSource(this.dataInit);
  dataLangsListObjectColumn = new MatTableDataSource(this.dataInit);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;
  @ViewChild('langTbSort') langTbSort = new MatSort();
  @ViewChild('langTbSortWithObject') langTbSortWithObject = new MatSort();

  constructor(
    private dialog: MatDialog,
    private _languageService: LanguageService,
    private _utilService: UtlitasService
  ) {}

  getLanguages() {
    this._languageService.list().subscribe({
      next: (data) => {
        console.log(data.value);
        if (data.status)
          this.dataLangsList.data = data.value;
        else
          this._utilService.showAlert("Неможливо отримати перелік мов", "Помилка");
      },
      error: (e) => {}
    })
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataLangsList.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngOnInit(): void {
    this.getLanguages();
  }

  ngAfterViewInit(): void {
    this.dataLangsList.paginator = this.paginationTable;
    this.langTbSort.disableClear = true;
    this.dataLangsList.sort = this.langTbSort;

    // this.langTbSortWithObject.disableClear = true;
    this.dataLangsListObjectColumn.sort = this.langTbSortWithObject;
    this.dataLangsListObjectColumn.sortingDataAccessor = (row: Language, columnName: string): string => {
      console.log(row, columnName);
      var columnValue = row[columnName as keyof Language] as string;
      return columnValue;
    }
  }

  newLanguage() {
    this.dialog.open(ModalLanguageComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getLanguages();
    })
  }

  editLanguage(language: Language) {
    this.dialog.open(ModalLanguageComponent, {
      disableClose: true,
      data: language
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getLanguages();
    })
  }

  deleteLanguage(language: Language) {
    Swal.fire({
      title: 'Впевнені щодо видалення мови?',
      html: '<div style="display: flex; flex-direction: row; justify-content: center;"><div style=""><img src="' + this.backendUrl + language.flag + '" style="height: 50px;" /></div><div style="margin: 15px;">' + language.name + '</div></div>',
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Tak, цілком",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "Ні, не треба"
    }).then((result) => {
      if (result.isConfirmed) {
        this._languageService.delete(language.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilService.showAlert("Мову видалено", "Зроблено");
              this.getLanguages();
            } else {
              this._utilService.showAlert("Неможливо видалити мову", "Помилка");
            }
          },
          error: (e) => {}
        })
      }
    })
  }

}
