import { Channel } from "./channel";
import { Language } from "./language";
import { ChannelBroadcast } from "./channel-broadcast";

export interface Country {
    id: number,
    name: string,
    description: string,
    flagUrl: string,
    coatArmsUrl: string,
    currency: string,
    isoNum: string,
    isoAlpha3: string,
    isoAlpha2: string,
    domain: string,
    phoneCode: string,
    channels: Channel[],
    languages: Language[],
    channelBroadcasts: ChannelBroadcast[]
}
