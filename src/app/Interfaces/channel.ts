import { ChannelBroadcast } from "./channel-broadcast";
import { Programme } from "./programme";
import { VideoStream } from "./video-stream";

export interface Channel {
    id: number,
    name: string,
    strKey: string,
    description: string,
    logoUrl: string,
    startTime: string,
    endTime: string,
    broadcastFrom: string,
    startAge: number,
    websiteUrl: string,
    categoryId: number,
    categoryDescription: string,
    countryId: number,
    countryDescription: string,
    timeShit: string,
    channelBroadcasts: ChannelBroadcast[],
    programmes: Programme[],
    videoStreams: VideoStream[]
}
