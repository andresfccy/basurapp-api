import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Pickup, PickupKind, PickupTimeSlot } from '../../domain/pickup.entity';
import {
  PICKUP_REPOSITORY,
  type PickupRepository,
} from '../ports/pickup.repository';

export interface SchedulePickupDto {
  userId: string;
  requesterName: string;
  requesterEmail: string;
  scheduledAt: Date;
  kind: PickupKind;
  locality: string;
  address: string;
  timeSlot: PickupTimeSlot;
}

@Injectable()
export class SchedulePickupUseCase {
  constructor(
    @Inject(PICKUP_REPOSITORY)
    private readonly pickupRepository: PickupRepository,
  ) {}

  async execute(dto: SchedulePickupDto): Promise<Pickup> {
    const pickup = Pickup.schedule({
      id: uuid(),
      userId: dto.userId,
      requesterEmail: dto.requesterEmail,
      requesterName: dto.requesterName,
      scheduledAt: dto.scheduledAt,
      kind: dto.kind,
      locality: dto.locality,
      address: dto.address,
      timeSlot: dto.timeSlot,
    });

    return this.pickupRepository.save(pickup);
  }
}
