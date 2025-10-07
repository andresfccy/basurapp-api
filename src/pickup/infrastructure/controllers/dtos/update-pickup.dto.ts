import { IsEnum, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PickupKind, PickupTimeSlot } from '../../../domain/pickup.entity';

export class UpdatePickupRequestDto {
  @ApiProperty({
    description:
      'Nueva fecha programada para la recolección en formato ISO 8601',
    example: '2025-06-05T14:00:00.000Z',
  })
  @IsISO8601()
  scheduledAt!: string;

  @ApiProperty({
    enum: PickupKind,
    description: 'Tipo de residuos a recolectar',
    example: PickupKind.INORGANICOS,
  })
  @IsEnum(PickupKind)
  kind!: PickupKind;

  @ApiProperty({
    description: 'Localidad en la que se realizará la recolección',
    example: 'Chapinero',
  })
  @IsString()
  @IsNotEmpty()
  locality!: string;

  @ApiProperty({
    description: 'Dirección exacta para la recolección',
    example: 'Carrera 9 #72-34',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    enum: PickupTimeSlot,
    description: 'Franja horaria para la visita',
    example: PickupTimeSlot.NOON,
  })
  @IsEnum(PickupTimeSlot)
  timeSlot!: PickupTimeSlot;
}
