import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSort,Sort } from '@angular/material/sort';
import { DatePipe, formatDate } from '@angular/common';

import { environment } from 'src/environments/environment';
import { ModalChannelComponent } from '../../Modals/modal-channel/modal-channel.component';
import { ModalStreamComponent } from '../../Modals/modal-stream/modal-stream.component';
import { StreamPreviewComponent } from '../../Modals/stream-preview/stream-preview.component';
import { Channel } from 'src/app/Interfaces/channel';
import { VideoStream } from 'src/app/Interfaces/video-stream';
import { ChannelService } from 'src/app/Services/channel.service';
import { VideoStreamService } from 'src/app/Services/video-stream.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css'],
  providers: [ DatePipe ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class ChannelComponent implements OnInit, AfterViewInit {
  public backendUrl: string = environment.endPoint;
  columnsTable: string[] = ['id', 'name', 'strKey', 'logoUrl', 'categoryDescription', 'countryDescription', 'broadcastFrom', 'websiteUrl', 'timeShit', 'actions'];
  columnsWithObject: string[] = ['id', 'name', 'strKey', 'categoryDescription', 'countryDescription', 'broadcastFrom'];
  streamsColumnsToDisplay = ['id', 'isHidden', 'streamUrl', 'actions'];
  dataInit: Channel[] = [];
  dataSource = new MatTableDataSource(this.dataInit);
  dataSourceObjectColumn = new MatTableDataSource(this.dataInit);
  videoStream: VideoStream;
  timeFormat: string = 'HH:mm';
  timeFormat2: string = 'hh:mm';
  dateFormat: string = "dd.MM.yyyy";
  expandedElement: VideoStream | null = null;
  @ViewChild(MatPaginator) paginationTable!: MatPaginator;
  @ViewChild('chanTbSort') chanTbSort = new MatSort();
  @ViewChild('chanTbSortWithObject') chanTbSortWithObject = new MatSort();

  constructor(
    private dialog: MatDialog,
    private _channelService: ChannelService,
    private _streamService: VideoStreamService,
    private _utilService: UtlitasService,
    private datePipe: DatePipe
  ) {
    this.videoStream = {
      id: 0,
      streamUrl: '',
      channelId: 0,
      isHidden: false,
    };
  }

  getChannels() {
    this._channelService.list().subscribe({
      next: (data) => {
        if (data.status)
          this.dataSource.data = data.value;
        else
          this._utilService.showAlert("Неможливо отримати список каналів", "Помилка");
      },
      error: (e) => {}
    })
  }

  applyTableFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginationTable;
    this.chanTbSort.disableClear = true;
    this.dataSource.sort = this.chanTbSort;

    // this.langTbSortWithObject.disableClear = true;
    this.dataSourceObjectColumn.sort = this.chanTbSortWithObject;
    this.dataSourceObjectColumn.sortingDataAccessor = (row: Channel, columnName: string): string => {
      var columnValue = row[columnName as keyof Channel] as string;
      return columnValue;
    }
  }

  ngOnInit(): void {
    this.getChannels();
  }

  getLocalTime(strTime: string)
  {
    return this.datePipe.transform("1/1/2000 " + strTime, this.timeFormat);
  }

  getTimeZone(strTime: string)
  {
    const fullDate = "1/1/2000 " + strTime;
    const ampm = new Date(fullDate).getHours() <= 12 ? '+' : '-';
    const retZone = ampm + this.datePipe.transform(fullDate, this.timeFormat2);
    if (retZone === "+12:00") {
      return "00:00";
    }
    return retZone;
  }

  getLocalDate(strDate: string)
  {
    if (strDate != null) {
      const allParts = strDate.split(' ');
      const parts = allParts[0].split('.');
      const mydate = new Date(parts[2]+"/"+parts[1]+"/"+parts[0]);
      return this.datePipe.transform(mydate, this.dateFormat, undefined, 'uk');
    } else {
      return null;
    }
  }

  newChannel() {
    this.dialog.open(ModalChannelComponent, {
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getChannels();
    })
  }

  addStream(channelId: number) {
    this.videoStream.channelId = channelId;
    this.videoStream.streamUrl = '';

    this.dialog.open(ModalStreamComponent, {
      disableClose: true,
      data: this.videoStream
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getChannels();
    })
  }

  editChannel(channel: Channel) {
    this.dialog.open(ModalChannelComponent, {
      disableClose: true,
      data: channel
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getChannels();
    })
  }

  editStream(videostream: VideoStream) {
    this.dialog.open(ModalStreamComponent, {
      disableClose: true,
      data: videostream
    }).afterClosed().subscribe(result => {
      if (result === 'true') this.getChannels();
    })
  }

  previewStream(videostream: VideoStream) {
    this.dialog.open(StreamPreviewComponent, {
      disableClose: true,
      data: videostream
    }).afterClosed().subscribe(result => {
      
    })
  }

  setStream(videostream: VideoStream) {
    videostream.isHidden = !videostream.isHidden;
    
    this._streamService.edit(videostream).subscribe({
      next: (data) => {
        if (data.status) {
          if (videostream.isHidden)
            this._utilService.showAlert("Відеопотік встановлено", "Зроблено");
          else
            this._utilService.showAlert("Відеопотік скинуто", "Зроблено");
        } else {
          this._utilService.showAlert("Неможливо маркувати відеопотік", "Помилка");
        }
      },
      error: (e) => {}
    })
  }

  deleteStream(videostream: VideoStream) {
    Swal.fire({
      title: 'Впевнені щодо видалення відеопотоку?',
      text: videostream.streamUrl,
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Tak, цілком",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "Ні, не треба"
    }).then((result) => {
      if (result.isConfirmed) {
        this._streamService.delete(videostream.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilService.showAlert("Відеопотік видалено", "Зроблено");
              this.getChannels();
            } else {
              this._utilService.showAlert("Неможливо видалити відеопотік", "Помилка");
            }
          },
          error: (e) => {}
        })
      }
    })
  }

  deleteChannel(channel: Channel) {
    Swal.fire({
      title: 'Впевнені щодо видалення каналу?',
      html: '<div style="display: flex; flex-direction: row; justify-content: center;"><div style=""><img src="' + this.backendUrl + channel.logoUrl + '" style="height: 50px;" /></div><div style="margin: 15px;">' + channel.name + '</div></div>',
      icon: "warning",
      confirmButtonColor: '#3085d6',
      confirmButtonText: "Tak, цілком",
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: "Ні, не треба"
    }).then((result) => {
      if (result.isConfirmed) {
        this._channelService.delete(channel.id).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilService.showAlert("Канал видалено", "Зроблено");
              this.getChannels();
            } else {
              this._utilService.showAlert("Неможливо видалити канал", "Помилка");
            }
          },
          error: (e) => {}
        })
      }
    })
  }
}
