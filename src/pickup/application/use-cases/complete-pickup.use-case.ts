import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../user/domain/user.entity';
import { Pickup } from '../../domain/pickup.entity';
import {
  PICKUP_REPOSITORY,
  type PickupRepository,
} from '../ports/pickup.repository';

export interface CompletePickupDto {
  pickupId: string;
  requesterId: string;
  requesterRole: UserRole;
  collectorUsername?: string | null;
  completedAt: Date;
  collectedWeightKg: number | null;
}

@Injectable()
export class CompletePickupUseCase {
  constructor(
    @Inject(PICKUP_REPOSITORY)
    private readonly pickupRepository: PickupRepository,
  ) {}

  async execute(dto: CompletePickupDto): Promise<Pickup> {
    const pickup = await this.pickupRepository.findById(dto.pickupId);

    if (!pickup) {
      throw new NotFoundException('Recolección no encontrada');
    }

    const isOwner = pickup.userId === dto.requesterId;
    const isAdmin = dto.requesterRole === UserRole.ADMIN;
    const collectorMatches =
      dto.collectorUsername &&
      pickup.staffUsername &&
      pickup.staffUsername.trim().toLowerCase() ===
        dto.collectorUsername.trim().toLowerCase();

    if (!isOwner && !isAdmin && !collectorMatches) {
      throw new ForbiddenException(
        'No tienes permisos para registrar esta recolección',
      );
    }

    const completed = pickup.markCompleted({
      completedAt: dto.completedAt,
      collectedWeightKg: dto.collectedWeightKg,
    });

    return this.pickupRepository.save(completed);
  }
}
