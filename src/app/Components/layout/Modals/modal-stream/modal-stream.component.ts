import { Component, OnInit, Inject } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { VideoStream } from 'src/app/Interfaces/video-stream';
import { VideoStreamService } from 'src/app/Services/video-stream.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';

@Component({
  selector: 'app-modal-stream',
  templateUrl: './modal-stream.component.html',
  styleUrls: ['./modal-stream.component.css']
})
export class ModalStreamComponent implements OnInit {
  formStream: FormGroup;
  actionTitle: string = "Додати";
  buttonAction: string = "Додати";

  constructor(
    private modalActual: MatDialogRef<ModalStreamComponent>,
    @Inject(MAT_DIALOG_DATA) public dataStream: VideoStream,
    private fb: FormBuilder,
    private _streamService: VideoStreamService,
    private _utilService: UtlitasService
  ) {
    this.formStream = this.fb.group({
      streamUrl: this.dataStream.streamUrl,
      channelId: this.dataStream.channelId,
      isHidden: this.dataStream.isHidden
    });

    console.log(this.dataStream);

    if (this.dataStream.streamUrl != '') {
      this.actionTitle = "Змінити";
      this.buttonAction = "Зберегти";
    }
  }

  ngOnInit(): void {

  }

  saveStream() {
    const _stream: VideoStream = {
      id: this.dataStream.streamUrl == '' ? 0 : this.dataStream.id,
      channelId: this.dataStream.channelId,
      isHidden: false,
      streamUrl: this.formStream.value.streamUrl
    }

    if (this.dataStream.streamUrl == '') {
      this._streamService.create(_stream).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Відеопотік додано", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося додати відеопотік", "Помилка");
          }
        },
        error: (e) => {}
      })
    } else {
      this._streamService.edit(_stream).subscribe({
        next: (data) => {
          if (data.status) {
            this._utilService.showAlert("Відеопотік збережено", "Успіх");
            this.modalActual.close("true");
          } else {
            this._utilService.showAlert("Не вдалося зберегти відеопотік", "Помилка");
          }
        },
        error: (e) => {}
      })
    }
  }
}
