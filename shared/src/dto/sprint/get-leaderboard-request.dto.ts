import { Type } from "class-transformer";
import { IsIn, IsOptional, IsString } from "class-validator";

export class GetLeaderboardRequestDto {
    @IsIn(['global', 'country'])
    type!: 'global' | 'country';

    @IsOptional()
    @IsString()
    countryCode?: string;

    @IsOptional()
    @Type(() => Number)
    limit?: number;
}