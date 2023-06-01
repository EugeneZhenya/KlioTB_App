import { Component, ElementRef, Input, ViewChild, OnInit, Inject } from '@angular/core';
import hls, { ManifestLoadedData } from 'hls.js';
import { VideoService } from 'src/app/Services/Video/video.service';
import { VolumeService } from 'src/app/Services/Video/volume.service';
import { VideoTimeService } from 'src/app/Services/Video/video-time.service';
import { VideoPlaylistService } from 'src/app/Services/Video/video-playlist.service';
import { VideoStream } from 'src/app/Interfaces/video-stream';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-stream-preview',
  templateUrl: './stream-preview.component.html',
  styleUrls: ['./stream-preview.component.css']
})
export class StreamPreviewComponent implements OnInit {
  public loading: boolean = false;
  public ignore: boolean = true;
  public playing = false;
  private hls = new hls();
  private videoListeners = {
    loadedmetadata: () => this.videoTimeService.setVideoDuration(this.video.nativeElement.duration),
    canplay: () => this.videoService.setLoading(false),
    seeking: () => this.videoService.setLoading(true),
    timeupdate: () => {
      if (!this.ignore) {
        this.videoTimeService.setVideoProgress(this.video.nativeElement.currentTime);
      }
      if (
        this.video.nativeElement.currentTime === this.video.nativeElement.duration &&
        this.video.nativeElement.duration > 0
      ) {
        this.videoService.pause();
        this.videoService.setVideoEnded(true);
      } else {
        this.videoService.setVideoEnded(false);
      }
    }
  };
  info: any;

  @ViewChild('video', { static: true }) private readonly video: ElementRef<HTMLVideoElement> | any;

  constructor(
    private modalActual: MatDialogRef<StreamPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public dataStream: VideoStream,
    private videoService: VideoService,
    private volumeService: VolumeService,
    private videoTimeService: VideoTimeService,
    private videoPlaylistService: VideoPlaylistService
  ) {}

  ngOnInit(): void {
    this.subscriptions();
    Object.keys(this.videoListeners).forEach(videoListener =>
      this.video.nativeElement.addEventListener(videoListener, this.videoListeners)
    );

    this.hls.on(hls.Events.MANIFEST_PARSED, (event, data) => {
      this.showDetails(data.levels);
    });

    this.load(this.dataStream.streamUrl);
  }

  showDetails(data: any) {
    this.info = data;
    console.log(this.info);
  }

  onVideoClick() {
    if (this.playing) {
      this.videoService.pause();
    } else {
      this.videoService.play();
    }
  }

  onDoubleClick() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const videoPlayerDiv = <HTMLVideoElement>document.querySelector('.video-player');
      if (videoPlayerDiv.requestFullscreen) {
        videoPlayerDiv.requestFullscreen();
      }
    }
  }

  load(currentVideo: string): void {
    if (hls.isSupported()) {
      this.loadVideoWithHLS(currentVideo);
    } else {
      if (this.video.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
        this.loadVideo(currentVideo);
      }
    }
  }

  playPauseVideo(playing: boolean) {
    this.playing = playing;
    this.video.nativeElement[playing ? 'play' : 'pause']();
  }

  subscriptions() {
    this.videoService.playingState$.subscribe(playing => this.playPauseVideo(playing));
    this.videoPlaylistService.currentVideo$.subscribe(video => this.load(video));
    this.videoTimeService.currentTime$.subscribe(currentTime => (this.video.nativeElement.currentTime = currentTime));
    this.volumeService.volumeValue$.subscribe(volume => (this.video.nativeElement.volume = volume));
    this.videoService.loading$.subscribe(loading => (this.loading = loading));
    this.videoTimeService.ignore$.subscribe(ignore => (this.ignore = ignore));
  }

  loadVideoWithHLS(currentVideo: string) {
    this.hls.loadSource(currentVideo);
    this.hls.attachMedia(this.video.nativeElement);
    // this.hls.on(HLS.Events.MANIFEST_PARSED, () => this.video.nativeElement.play());
  }

  loadVideo(currentVideo: string) {
    this.video.nativeElement.src = currentVideo;
  }
}
