import { Channel } from "./channel";

export interface Category {
    id: number,
    name: string,
    isHidden: number,
    channels: Channel[]
}
