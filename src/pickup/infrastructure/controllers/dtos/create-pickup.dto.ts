import { IsEnum, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PickupKind, PickupTimeSlot } from '../../../domain/pickup.entity';

export class CreatePickupRequestDto {
  @ApiProperty({
    description:
      'Fecha y hora programada para la recolección en formato ISO 8601',
    example: '2025-06-02T13:00:00.000Z',
  })
  @IsISO8601()
  scheduledAt!: string;

  @ApiProperty({
    enum: PickupKind,
    description: 'Tipo de residuos a recolectar',
    example: PickupKind.ORGANICO,
  })
  @IsEnum(PickupKind)
  kind!: PickupKind;

  @ApiProperty({
    description: 'Localidad en la que se realizará la recolección',
    example: 'Suba',
  })
  @IsString()
  @IsNotEmpty()
  locality!: string;

  @ApiProperty({
    description: 'Dirección exacta para la recolección',
    example: 'Calle 132 #56-21',
  })
  @IsString()
  @IsNotEmpty()
  address!: string;

  @ApiProperty({
    enum: PickupTimeSlot,
    description: 'Franja horaria solicitada',
    example: PickupTimeSlot.MORNING,
  })
  @IsEnum(PickupTimeSlot)
  timeSlot!: PickupTimeSlot;
}
