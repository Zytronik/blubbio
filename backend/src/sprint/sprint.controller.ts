import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CreateSprintResponseDto, CreateSprintRequestDto, GetLeaderboardRequestDto, GetLeaderboardResponseDto } from '@shared/types';
import type { AuthenticatedRequest } from 'src/auth/types/auth-request.type';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('sprint')
export class SprintController {
    constructor(private readonly sprintService: SprintService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: 'Create a new sprint' })
    @ApiOkResponse({ type: CreateSprintResponseDto })
    async createSprint(
        @Req() req: AuthenticatedRequest,
        @Body() dto: CreateSprintRequestDto,
    ) {
        return this.sprintService.createSprint(req.user.uid, dto);
    }

    @Get('leaderboard')
    @ApiOperation({ summary: 'Get the global or country-specific leaderboard' })
    @ApiOkResponse({ type: GetLeaderboardResponseDto })
    async getLeaderboard(
        @Query('type') type: 'global' | 'country',
        @Query('countryCode') countryCode?: string,
        @Query('limit') limit = '10',
    ): Promise<GetLeaderboardResponseDto> {
        const parsedLimit = Number(limit);

        if (type === 'country') {
            return this.sprintService.getCountryLeaderboard(
                countryCode!,
                parsedLimit,
            );
        }

        return this.sprintService.getGlobalLeaderboard(parsedLimit);
    }
}
