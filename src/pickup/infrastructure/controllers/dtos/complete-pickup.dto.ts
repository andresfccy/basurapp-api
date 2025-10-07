import { Transform } from 'class-transformer';
import { IsISO8601, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CompletePickupRequestDto {
  @ApiProperty({
    description: 'Fecha y hora de finalización en formato ISO 8601',
    example: '2025-06-02T16:35:00.000Z',
  })
  @IsISO8601()
  completedAt!: string;

  @ApiPropertyOptional({
    description:
      'Peso total recogido en kilogramos (solo residuos inorgánicos)',
    example: 185.7,
    minimum: 0,
  })
  @Transform(({ value }) =>
    value === null || value === undefined ? undefined : Number(value),
  )
  @IsOptional()
  @IsNumber()
  @Min(0)
  collectedWeightKg?: number;
}
