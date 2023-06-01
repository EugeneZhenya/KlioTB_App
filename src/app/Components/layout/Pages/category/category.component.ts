import { Component, OnInit } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { Category } from 'src/app/Interfaces/category';
import { CategoryService } from 'src/app/Services/category.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  displayedColumns = ['id', 'name', 'isHidden'];
  dataSource: Category[] = [];
  dataCatsList = new MatTableDataSource(this.dataSource);

  constructor(
    private _categoryService: CategoryService,
    private _utilService: UtlitasService
  ) {}

  getCategories() {
    this._categoryService.list().subscribe({
      next: (data) => {
        if (data.status)
          this.dataCatsList.data = data.value;
        else
          this._utilService.showAlert("Неможливо отримати список категорій", "Помилка");
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    this.getCategories();
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataCatsList.filter = filterValue.trim().toLocaleLowerCase();
  }

  visibleUnvisible(cat: Category) {
    cat.isHidden = cat.isHidden ? 0 : 1;
    let indexToUpdate = this.dataSource.findIndex(item => item.id === cat.id);
    this.dataSource[indexToUpdate] = cat;

    this._categoryService.edit(cat).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilService.showAlert("Категорію змінено та збережено", "Успіх");
        } else {
          this._utilService.showAlert("Не вдалося зберегти категорію", "Помилка");
        }
      },
      error: (e) => {}
    })
  }

  sendTheNewValue(cat: Category){
    if (cat.id === 0) {
      this._categoryService.create(cat).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Категорію створено", "Успіх");
            this.getCategories();
          } else {
            this._utilService.showAlert("Не вдалося створити категорію", "Помилка");
          }
        },
        error: (e) => {}
      })
    } else {
      this._categoryService.edit(cat).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Категорію змінено та збережено", "Успіх");
          } else {
            this._utilService.showAlert("Не вдалося зберегти категорію", "Помилка");
          }
        },
        error: (e) => {}
      })
    }
  }

  AddCat() {
    const count: number = this.dataCatsList.data.length + 1;
    const newCat: Category = {
      id: 0,
      name: '',
      isHidden: 0,
      channels: []
    };
    this.dataCatsList.data.push(newCat);
    this.dataCatsList = new MatTableDataSource(this.dataCatsList.data);
  }

  deleteCategory(cat: Category) {
    Swal.fire({
      title: 'Впевнені щодо видалення категорії?',
      text: cat.name,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Tak, цілком",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "Ні, не треба"
    }).then((result) => {
      if (result.isConfirmed) {
        this._categoryService.delete(cat.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilService.showAlert("Категорію видалено", "Зроблено");
              this.getCategories();
            } else {
              this._utilService.showAlert("Неможливо видалити категорію", "Помилка");
            }
          },
          error: (e) => {}
        })
      }
    })
  }
}
