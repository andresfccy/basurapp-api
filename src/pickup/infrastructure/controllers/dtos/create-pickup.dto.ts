import { IsEnum, IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { PickupKind, PickupTimeSlot } from '../../../domain/pickup.entity';

export class CreatePickupRequestDto {
  @IsISO8601()
  scheduledAt!: string;

  @IsEnum(PickupKind)
  kind!: PickupKind;

  @IsString()
  @IsNotEmpty()
  locality!: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsEnum(PickupTimeSlot)
  timeSlot!: PickupTimeSlot;
}
