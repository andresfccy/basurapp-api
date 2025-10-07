import { Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../../../user/domain/user.entity';
import { Pickup } from '../../domain/pickup.entity';
import {
  PICKUP_REPOSITORY,
  type PickupRepository,
} from '../ports/pickup.repository';

export interface ListPickupsDto {
  userId: string;
  role: UserRole;
  staffUsername?: string | null;
}

@Injectable()
export class ListPickupsUseCase {
  constructor(
    @Inject(PICKUP_REPOSITORY)
    private readonly pickupRepository: PickupRepository,
  ) {}

  async execute(dto: ListPickupsDto): Promise<Pickup[]> {
    if (dto.role === UserRole.ADMIN) {
      return this.pickupRepository.findAll();
    }

    if (dto.role === UserRole.COLLECTOR) {
      const username = dto.staffUsername?.trim();
      if (!username) {
        return [];
      }
      return this.pickupRepository.findByStaffUsername(username.toLowerCase());
    }

    return this.pickupRepository.findByUserId(dto.userId);
  }
}
