import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ListPickupsUseCase } from '../../application/use-cases/list-pickups.use-case';
import { SchedulePickupUseCase } from '../../application/use-cases/schedule-pickup.use-case';
import { UpdatePickupUseCase } from '../../application/use-cases/update-pickup.use-case';
import { ArchivePickupUseCase } from '../../application/use-cases/archive-pickup.use-case';
import { CompletePickupUseCase } from '../../application/use-cases/complete-pickup.use-case';
import { Pickup } from '../../domain/pickup.entity';
import { UserRole } from '../../../user/domain/user.entity';
import { CreatePickupRequestDto } from './dtos/create-pickup.dto';
import { UpdatePickupRequestDto } from './dtos/update-pickup.dto';
import { CompletePickupRequestDto } from './dtos/complete-pickup.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  };
};

@ApiTags('pickups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pickups')
export class PickupController {
  constructor(
    private readonly listPickupsUseCase: ListPickupsUseCase,
    private readonly schedulePickupUseCase: SchedulePickupUseCase,
    private readonly updatePickupUseCase: UpdatePickupUseCase,
    private readonly archivePickupUseCase: ArchivePickupUseCase,
    private readonly completePickupUseCase: CompletePickupUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar recolecciones',
    description:
      'Devuelve la lista de recolecciones visibles para el usuario autenticado',
  })
  async list(@Request() req: AuthenticatedRequest) {
    const pickups = await this.listPickupsUseCase.execute({
      userId: req.user.id,
      role: req.user.role,
      staffUsername: req.user.email,
    });

    return pickups.map((pickup) => this.toResponse(pickup));
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Programar recolección',
  })
  async create(
    @Body() dto: CreatePickupRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const requesterName =
      [req.user.firstName, req.user.lastName].filter(Boolean).join(' ') ||
      req.user.email;

    const pickup = await this.schedulePickupUseCase.execute({
      userId: req.user.id,
      requesterEmail: req.user.email,
      requesterName,
      scheduledAt: new Date(dto.scheduledAt),
      kind: dto.kind,
      locality: dto.locality,
      address: dto.address,
      timeSlot: dto.timeSlot,
    });

    return this.toResponse(pickup);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Actualizar recolección',
  })
  async update(
    @Param('id') pickupId: string,
    @Body() dto: UpdatePickupRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const pickup = await this.updatePickupUseCase.execute({
      pickupId,
      requesterId: req.user.id,
      requesterRole: req.user.role,
      scheduledAt: new Date(dto.scheduledAt),
      kind: dto.kind,
      locality: dto.locality,
      address: dto.address,
      timeSlot: dto.timeSlot,
    });

    return this.toResponse(pickup);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archivar recolección',
    description: 'Archiva una recolección sin eliminarla físicamente',
  })
  async archive(
    @Param('id') pickupId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const pickup = await this.archivePickupUseCase.execute({
      pickupId,
      requesterId: req.user.id,
      requesterRole: req.user.role,
    });

    return this.toResponse(pickup);
  }

  @Patch(':id/complete')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({
    summary: 'Registrar recolección completada',
  })
  async complete(
    @Param('id') pickupId: string,
    @Body() dto: CompletePickupRequestDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const pickup = await this.completePickupUseCase.execute({
      pickupId,
      requesterId: req.user.id,
      requesterRole: req.user.role,
      collectorUsername: req.user.email,
      completedAt: new Date(dto.completedAt),
      collectedWeightKg:
        dto.collectedWeightKg === undefined ? null : dto.collectedWeightKg,
    });

    return this.toResponse(pickup);
  }

  private toResponse(pickup: Pickup) {
    return {
      id: pickup.id,
      scheduledAt: pickup.scheduledAt.toISOString(),
      status: pickup.status,
      staff: pickup.staffName,
      staffUsername: pickup.staffUsername,
      requestedBy: pickup.requesterName,
      kind: pickup.kind,
      locality: pickup.locality,
      address: pickup.address,
      timeSlot: pickup.timeSlot,
      collectedWeightKg: pickup.collectedWeightKg,
      archived: pickup.archived,
      completedAt: pickup.completedAt ? pickup.completedAt.toISOString() : null,
    };
  }
}
