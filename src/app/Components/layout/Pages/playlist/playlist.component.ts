import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { CdkDragDrop, CdkDragStart, moveItemInArray, transferArrayItem, CdkDragHandle } from '@angular/cdk/drag-drop';

import { PlaylistChannel } from 'src/app/Interfaces/playlist-channel';
import { Channel } from 'src/app/Interfaces/channel';
import { StreamPreviewComponent } from '../../Modals/stream-preview/stream-preview.component';
import { MatDialog } from '@angular/material/dialog';

import { PlaylistService } from 'src/app/Services/playlist.service';
import { ChannelService } from 'src/app/Services/channel.service';
import { UtlitasService } from 'src/app/Reusable/utlitas.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  public backendUrl: string = environment.endPoint;
  @ViewChild(MatTable) table: MatTable<any> | any;
  displayedColumns: string[] = ['id', 'logo', 'name', 'category', 'country', 'actions'];
  dataSource: PlaylistChannel[] = [];
  channelsList: Channel[] = [];
  dragDisabled = true;
  selected = 0;

  constructor(
    private _playlistService: PlaylistService,
    private _channelService: ChannelService,
    private _utilService: UtlitasService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.getPlaylist();
  }

  getPlaylist() {
    this._playlistService.get(1).subscribe({
      next: (data) => {
        if (data.status)
        {
          this.dataSource = data.value;
          this._channelService.list().subscribe({
            next: (data) => {
              if (data.status)
              {
                // this.channelsList = data.value;
                var i = 0;
                while (i < data.value.length) {
                  var entry1 = data.value[i];
                  if (this.dataSource.some(q => q.channelId == entry1.id)) {
                    // Found, progress to next
                    ++i;
                } else {
                    // Not found, remove
                    this.channelsList.push(entry1);
                    ++i;
                }}
                this.channelsList.forEach(obj => {
                  for (var i = obj.videoStreams.length - 1; i >= 0; i--) {
                    if (!obj.videoStreams[i].isHidden) {
                        obj.videoStreams.splice(i, 1);
                    }
                  }
                });
              }
              else
                this._utilService.showAlert("Неможливо отримати список каналів", "Помилка");
            },
            error: (e) => {}
          })
        }
        else
          this._utilService.showAlert("Неможливо отримати список каналів", "Помилка");
      },
      error: (e) => {}
    })
  }

  watch(channelInfo: PlaylistChannel) {
    this.dialog.open(StreamPreviewComponent, {
      disableClose: true,
      data: channelInfo.channel.videoStreams[0]
    }).afterClosed().subscribe(result => {
      
    })
  }

  drop(event: CdkDragDrop<PlaylistChannel[]>) {
    // Return the drag container to disabled.
    this.dragDisabled = true;

    const previousIndex = this.dataSource.findIndex((d) => d === event.item.data);

    moveItemInArray(this.dataSource, previousIndex, event.currentIndex);
    this.dataSource.forEach((currentValue, index) => {
      currentValue.order = index + 1;
    });

    this.table.renderRows();
  }

  addChannel() {
    if (this.selected != 0) {
      const newChannel = this.channelsList.find(x => x.id === this.selected);

      if (newChannel != undefined) {
        const nweChannel: Channel = {
          id: newChannel.id,
          name: newChannel.name,
          strKey: newChannel.strKey,
          description: newChannel.description,
          logoUrl: newChannel.logoUrl,
          startTime: newChannel.startTime,
          endTime: newChannel.endTime,
          broadcastFrom: newChannel.broadcastFrom,
          startAge: newChannel.startAge,
          websiteUrl: newChannel.websiteUrl,
          categoryId: newChannel.categoryId,
          categoryDescription: newChannel.categoryDescription,
          countryId: newChannel.countryId,
          countryDescription: newChannel.countryDescription,
          timeShit: newChannel.timeShit,
          channelBroadcasts: newChannel.channelBroadcasts,
          programmes: newChannel.programmes,
          videoStreams: newChannel.videoStreams
        };

        const newRow: PlaylistChannel = {
          playlistId: 1,
          channelId: this.selected,
          order: this.dataSource.length + 1,
          channel: nweChannel
        };

        this.dataSource.push(newRow);
        this.table.renderRows();
      }
    }
  }

  savePlaylist() {
    console.log(this.dataSource);
    this._playlistService.create(this.dataSource).subscribe({
      next: (data) => {
        if (data.status) {
          this._utilService.showAlert("Плейліст створено", "Успіх");
        } else {
          this._utilService.showAlert("Не вдалося створити плейліст", "Помилка");
        }
      },
      error: (e) => {}
    })
  }
}
