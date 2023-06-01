import { Channel } from "./channel";

export interface DashBoard {
    totalChannels: number,
    totalCountries: number,
    totalCategories: number,
    totalLanguages: number,
    totalStreams: number,
    channels: Channel[]
}
