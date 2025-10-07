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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { ListPickupsUseCase } from '../../application/use-cases/list-pickups.use-case';
import { SchedulePickupUseCase } from '../../application/use-cases/schedule-pickup.use-case';
import { UpdatePickupUseCase } from '../../application/use-cases/update-pickup.use-case';
import { ArchivePickupUseCase } from '../../application/use-cases/archive-pickup.use-case';
import { CompletePickupUseCase } from '../../application/use-cases/complete-pickup.use-case';
import {
  Pickup,
  PickupKind,
  PickupStatus,
  PickupTimeSlot,
} from '../../domain/pickup.entity';
import { UserRole } from '../../../user/domain/user.entity';
import { CreatePickupRequestDto } from './dtos/create-pickup.dto';
import { UpdatePickupRequestDto } from './dtos/update-pickup.dto';
import { CompletePickupRequestDto } from './dtos/complete-pickup.dto';
import { PickupResponseDto } from './dtos/pickup-response.dto';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  };
};

const pickupExample = {
  id: 'pk-001',
  scheduledAt: '2025-06-02T13:00:00.000Z',
  status: PickupStatus.PENDING,
  staff: null,
  staffUsername: null,
  requestedBy: 'Andrea Morales',
  kind: PickupKind.ORGANICO,
  locality: 'Suba',
  address: 'Calle 132 #56-21',
  timeSlot: PickupTimeSlot.MORNING,
  collectedWeightKg: null,
  archived: false,
  completedAt: null,
} as const satisfies PickupResponseDto;

const completedPickupExample = {
  id: 'pk-045',
  scheduledAt: '2025-06-03T18:45:00.000Z',
  status: PickupStatus.COMPLETED,
  staff: 'Laura García',
  staffUsername: 'recolector',
  requestedBy: 'Andrea Morales',
  kind: PickupKind.INORGANICOS,
  locality: 'Fontibón',
  address: 'Calle 23 #103-42',
  timeSlot: PickupTimeSlot.EVENING,
  collectedWeightKg: 182.4,
  archived: false,
  completedAt: '2025-06-03T19:20:00.000Z',
} as const satisfies PickupResponseDto;

const archivedPickupExample = {
  ...pickupExample,
  status: PickupStatus.REJECTED,
  archived: true,
} as const satisfies PickupResponseDto;

@ApiTags('pickups')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiExtraModels(PickupResponseDto)
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
  @ApiOkResponse({
    description:
      'Listado de recolecciones visibles para el usuario autenticado',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(PickupResponseDto) },
      example: [pickupExample, completedPickupExample],
    },
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
  @ApiCreatedResponse({
    description: 'Recolección programada correctamente',
    schema: {
      $ref: getSchemaPath(PickupResponseDto),
      example: pickupExample,
    },
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos en la solicitud' })
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
  @ApiOkResponse({
    description: 'Recolección actualizada correctamente',
    schema: {
      $ref: getSchemaPath(PickupResponseDto),
      example: {
        ...pickupExample,
        scheduledAt: '2025-06-05T14:00:00.000Z',
        locality: 'Chapinero',
        address: 'Carrera 9 #72-34',
        timeSlot: PickupTimeSlot.NOON,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos en la solicitud' })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene permisos para modificar la recolección',
  })
  @ApiNotFoundResponse({ description: 'Recolección no encontrada' })
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
  @ApiOkResponse({
    description: 'Recolección archivada correctamente',
    schema: {
      $ref: getSchemaPath(PickupResponseDto),
      example: archivedPickupExample,
    },
  })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene permisos para archivar la recolección',
  })
  @ApiNotFoundResponse({ description: 'Recolección no encontrada' })
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
  @ApiOkResponse({
    description: 'Recolección registrada como completada',
    schema: {
      $ref: getSchemaPath(PickupResponseDto),
      example: completedPickupExample,
    },
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos en la solicitud' })
  @ApiForbiddenResponse({
    description: 'El usuario no tiene permisos para completar la recolección',
  })
  @ApiNotFoundResponse({ description: 'Recolección no encontrada' })
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
