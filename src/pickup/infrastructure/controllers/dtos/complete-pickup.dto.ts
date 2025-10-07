import { Transform } from 'class-transformer';
import { IsISO8601, IsNumber, IsOptional, Min } from 'class-validator';

export class CompletePickupRequestDto {
  @IsISO8601()
  completedAt!: string;

  @Transform(({ value }) =>
    value === null || value === undefined ? undefined : Number(value),
  )
  @IsOptional()
  @IsNumber()
  @Min(0)
  collectedWeightKg?: number;
}
