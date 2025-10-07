import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PICKUP_REPOSITORY } from './application/ports/pickup.repository';
import { SchedulePickupUseCase } from './application/use-cases/schedule-pickup.use-case';
import { ListPickupsUseCase } from './application/use-cases/list-pickups.use-case';
import { UpdatePickupUseCase } from './application/use-cases/update-pickup.use-case';
import { ArchivePickupUseCase } from './application/use-cases/archive-pickup.use-case';
import { CompletePickupUseCase } from './application/use-cases/complete-pickup.use-case';
import {
  PickupDocument,
  PickupSchema,
} from './infrastructure/adapters/persistence/pickup.schema';
import { MongoosePickupRepository } from './infrastructure/adapters/persistence/mongoose-pickup.repository';
import { PickupController } from './infrastructure/controllers/pickup.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PickupDocument.name, schema: PickupSchema },
    ]),
  ],
  controllers: [PickupController],
  providers: [
    {
      provide: PICKUP_REPOSITORY,
      useClass: MongoosePickupRepository,
    },
    SchedulePickupUseCase,
    ListPickupsUseCase,
    UpdatePickupUseCase,
    ArchivePickupUseCase,
    CompletePickupUseCase,
  ],
})
export class PickupModule {}
