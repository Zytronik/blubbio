import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { CreateSprintResponseDto, CreateSprintRequestDto } from '@shared/types';
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
        console.log("req", req);
        return this.sprintService.createSprint(req.user.uid, dto);
    }
}
