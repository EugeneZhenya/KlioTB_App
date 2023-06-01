import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort,Sort } from '@angular/material/sort';

import { environment } from 'src/environments/environment';
import { ModalCountryComponent } from '../../Modals/modal-country/modal-country.component';
import { Country } from 'src/app/Interfaces/country';
import { CountryService } from 'src/app/Services/country.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit, AfterViewInit {
  public backendUrl: string = environment.endPoint;
  columnsTable: string[] = ['id', 'name', 'flagUrl', 'coatArmsUrl', 'currency', 'isoNum', 'isoAlpha3', 'isoAlpha2', 'domain', 'phoneCode', 'actions'];
  columnsWithObject: string[] = ['id', 'name', 'currency', 'isoNum', 'isoAlpha3', 'isoAlpha2', 'domain', 'phoneCode'];
  dataInit: Country[] = [];
  dataCountriesList = new MatTableDataSource(this.dataInit);
  dataCountriesListObjectColumn = new MatTableDataSource(this.dataInit);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;
  @ViewChild('countryTbSort') countryTbSort = new MatSort();
  @ViewChild('countryTbSortWithObject') countryTbSortWithObject = new MatSort();

  constructor(
    private dialog: MatDialog,
    private _countryService: CountryService,
    private _utilService: UtlitasService
  ) {}

  getCountries() {
    this._countryService.list().subscribe({
      next: (data) => {
        if (data.status)
          this.dataCountriesList.data = data.value;
        else
          this._utilService.showAlert("Неможливо отримати список країн", "Помилка");
      },
      error: (e) => {}
    })
  }

  ngAfterViewInit(): void {
    this.dataCountriesList.paginator = this.paginationTable;
    this.countryTbSort.disableClear = true;
    this.dataCountriesList.sort = this.countryTbSort;

    // this.countryTbSortWithObject.disableClear = true;
    this.dataCountriesListObjectColumn.sort = this.countryTbSortWithObject;
    this.dataCountriesListObjectColumn.sortingDataAccessor = (row: Country, columnName: string): string => {
      var columnValue = row[columnName as keyof Country] as string;
      return columnValue;
    }
  }

  ngOnInit(): void {
    this.getCountries();
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataCountriesList.filter = filterValue.trim().toLocaleLowerCase();
  }

  newCountry() {
    this.dialog.open(ModalCountryComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getCountries();
    })
  }

  editCountry(country: Country) {
    this.dialog.open(ModalCountryComponent, {
      disableClose: true,
      data: country
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getCountries();
    })
  }

  deleteCountry(country: Country) {
    Swal.fire({
      title: 'Впевнені щодо видалення країни?',
      html: '<div style="display: flex; flex-direction: row; justify-content: center;"><div style=""><img src="' + this.backendUrl + country.flagUrl + '" style="height: 50px;" /></div><div style="margin: 15px;">' + country.name + '</div><div style=""><img src="' + this.backendUrl + country.coatArmsUrl + '" style="height: 50px;" /></div></div>',
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Tak, цілком",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "Ні, не треба"
    }).then((result) => {
      if (result.isConfirmed) {
        this._countryService.delete(country.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilService.showAlert("Країну видалено", "Зроблено");
              this.getCountries();
            } else {
              this._utilService.showAlert("Неможливо видалити країну", "Помилка");
            }
          },
          error: (e) => {}
        })
      }
    })
  }

}
