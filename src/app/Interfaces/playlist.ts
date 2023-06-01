import { PlaylistChannel } from "./playlist-channel";

export interface Playlist {
    playlistId: number,
    name: string,
    channels: PlaylistChannel[]
}
