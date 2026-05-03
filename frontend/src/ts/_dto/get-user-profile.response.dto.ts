export class GetUserProfileResponseDto {
    uid!: string;
    username!: string;
    email!: string;
    countryCode?: string;
    country?: string;
    pbUrl?: string;
    bannerUrl?: string;
    lastDisconnectedAt?: Date;
    settings?: string;
    createdAt!: Date;
}