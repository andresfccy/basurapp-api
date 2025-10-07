import { ApiProperty } from '@nestjs/swagger';
import {
  PickupKind,
  PickupStatus,
  PickupTimeSlot,
} from '../../../domain/pickup.entity';

export class PickupResponseDto {
  @ApiProperty({
    description: 'Identificador único de la recolección',
    example: 'pk-37e6f8d0-e8de-4b55-9e1a-32f6cd5d917d',
  })
  id!: string;

  @ApiProperty({
    description:
      'Fecha programada o de finalización de la recolección en formato ISO 8601',
    example: '2025-05-18T13:00:00.000Z',
  })
  scheduledAt!: string;

  @ApiProperty({
    enum: PickupStatus,
    description: 'Estado actual de la recolección',
    example: PickupStatus.PENDING,
  })
  status!: PickupStatus;

  @ApiProperty({
    description: 'Nombre del personal asignado',
    example: 'Laura García',
    nullable: true,
  })
  staff!: string | null;

  @ApiProperty({
    description: 'Identificador o usuario del personal asignado',
    example: 'recolector',
    nullable: true,
  })
  staffUsername!: string | null;

  @ApiProperty({
    description: 'Nombre de la persona que solicitó la recolección',
    example: 'Andrea Morales',
    nullable: true,
  })
  requestedBy!: string | null;

  @ApiProperty({
    enum: PickupKind,
    description: 'Tipo de residuos a recolectar',
    example: PickupKind.INORGANICOS,
  })
  kind!: PickupKind;

  @ApiProperty({
    description: 'Localidad en la que se realizará la recolección',
    example: 'Suba',
  })
  locality!: string;

  @ApiProperty({
    description: 'Dirección exacta de la recolección',
    example: 'Calle 132 #56-21',
  })
  address!: string;

  @ApiProperty({
    enum: PickupTimeSlot,
    description: 'Franja horaria en la que se realizará la recolección',
    example: PickupTimeSlot.MORNING,
  })
  timeSlot!: PickupTimeSlot;

  @ApiProperty({
    description: 'Peso recogido en kilogramos (solo residuos inorgánicos)',
    example: 145.5,
    nullable: true,
  })
  collectedWeightKg!: number | null;

  @ApiProperty({
    description: 'Indica si la recolección fue archivada',
    example: false,
  })
  archived!: boolean;

  @ApiProperty({
    description:
      'Fecha efectiva de finalización si la recolección ya fue completada',
    example: '2025-05-18T15:22:00.000Z',
    nullable: true,
  })
  completedAt!: string | null;
}
