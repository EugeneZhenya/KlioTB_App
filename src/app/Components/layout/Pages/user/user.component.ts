import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { ModalUserComponent } from '../../Modals/modal-user/modal-user.component';
import { User } from 'src/app/Interfaces/user';
import { UserService } from 'src/app/Services/user.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, AfterViewInit {
  columnsTable: string[] = ['fullName', 'email', 'roleDescription', 'isActive', 'actions'];
  dataInit: User[] = [];
  dataUsersList = new MatTableDataSource(this.dataInit);
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _userService: UserService,
    private _utilService: UtlitasService
  ) {}

  getUsers() {
    this._userService.list().subscribe({
      next: (data) => {
        if (data.status)
          this.dataUsersList.data = data.value;
        else
          this._utilService.showAlert("Неможливо отримати список користувачів", "Помилка");
      },
      error: (e) => {}
    })
  }

  ngAfterViewInit(): void {
    this.dataUsersList.paginator = this.paginationTable;
  }

  ngOnInit(): void {
    this.getUsers();
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataUsersList.filter = filterValue.trim().toLocaleLowerCase();
  }

  newUser() {
    this.dialog.open(ModalUserComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getUsers();
    })
  }

  editUser(user: User) {
    this.dialog.open(ModalUserComponent, {
      disableClose: true,
      data: user
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getUsers();
    })
  }

  deleteUser(user: User) {
    Swal.fire({
      title: 'Впевнені щодо видалення користувача?',
      text: user.fullName,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Tak, цілком",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "Ні, не треба"
    }).then((result) => {
      if (result.isConfirmed) {
        this._userService.delete(user.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilService.showAlert("Користувача видалено", "Зроблено");
              this.getUsers();
            } else {
              this._utilService.showAlert("Неможливо видалити користувача", "Помилка");
            }
          },
          error: (e) => {}
        })
      }
    })
  }

}
