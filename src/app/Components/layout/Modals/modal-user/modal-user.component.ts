import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from 'src/app/Interfaces/role';
import { User } from 'src/app/Interfaces/user';

import { RoleService } from 'src/app/Services/role.service';
import { UserService } from 'src/app/Services/user.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  formUser: FormGroup;
  hidePassword: boolean = true;
  actionTitle: string = "Додати";
  buttonAction: string = "Створити";
  listRoles: Role[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUserComponent>,
    @Inject(MAT_DIALOG_DATA) public dataUser: User,
    private fb: FormBuilder,
    private _roleService: RoleService,
    private _userService: UserService,
    private _utilService: UtlitasService
  ) {
    this.formUser = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      roleId: ['', Validators.required],
      password: ['', Validators.required],
      isActive: ['1', Validators.required]
    });

    if (this.dataUser != null) {
      this.actionTitle = "Змінити";
      this.buttonAction = "Зберегти";
    }

    this._roleService.list().subscribe({
      next: (data) => {
        if (data.status) this.listRoles = data.value
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    if (this.dataUser != null) {
      this.formUser.patchValue({
        fullName: this.dataUser.fullName,
        email: this.dataUser.email,
        roleId: this.dataUser.roleId,
        password: this.dataUser.password,
        isActive: this.dataUser.isActive.toString()
      })
    }
  }

  saveUser() {
    const _user: User = {
      id: this.dataUser == null ? 0 : this.dataUser.id,
      fullName: this.formUser.value.fullName,
      email: this.formUser.value.email,
      roleId: this.formUser.value.roleId,
      roleDescription: "",
      password: this.formUser.value.password,
      isActive: parseInt(this.formUser.value.isActive)
    }

    if (this.dataUser == null) {
      this._userService.create(_user).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Користувача створено", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося створити користувача", "Помилка");
          }
        },
        error: (e) => {}
      })
    } else {
      this._userService.edit(_user).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Користувача збережено", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося зберегти користувача", "Помилка");
          }
        },
        error: (e) => {}
      })
    }
  }

}
