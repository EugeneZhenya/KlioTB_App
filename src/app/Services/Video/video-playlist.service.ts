import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VideoStream } from '../../Interfaces/video-stream';
import { VideoService } from './video.service';

@Injectable({
  providedIn: 'root'
})
export class VideoPlaylistService {
  private list = new BehaviorSubject<VideoStream[]>([]);
  private currentVideo = new BehaviorSubject<string>('');
  private shouldPlayNext = new BehaviorSubject<boolean>(true);

  public constructor(private videoService: VideoService) {}

  public setShouldPlayNext(playNext: boolean): void {
    this.shouldPlayNext.next(playNext);
  }

  public get shouldPlayNext$(): Observable<boolean> {
    return this.shouldPlayNext.asObservable();
  }

  public get list$(): Observable<VideoStream[]> {
    return this.list.asObservable();
  }

  public get currentVideo$(): Observable<string> {
    return this.currentVideo.asObservable();
  }

  public setCurrentVideo(video: string): void {
    if (this.currentVideo.getValue() !== video) {
      this.currentVideo.next(video);
      this.videoService.pause();
    }
  }

  public playNextVideo(): void {
    const activeIndex = this.list.getValue().findIndex(video => this.currentVideo.getValue() === video.streamUrl);
    this.setCurrentVideoByIndex(activeIndex + 1);
  }

  public setCurrentVideoByIndex(index: number): void {
    this.setCurrentVideo(this.list.getValue()[index].streamUrl);
  }

  public fetchList(endpoint: string): void {
    fetch(endpoint)
      .then(response => response.json())
      .then((playlist: VideoStream[]) => {
        this.list.next(playlist);
        this.setCurrentVideo(playlist[0].streamUrl);
      });
  }
}
