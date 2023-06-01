import { Channel } from "./channel";

export interface PlaylistChannel {
    playlistId: number,
    channelId: number,
    order: number,
    channel: Channel
}
