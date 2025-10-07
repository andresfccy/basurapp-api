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

export interface ArchivePickupDto {
  pickupId: string;
  requesterId: string;
  requesterRole: UserRole;
}

@Injectable()
export class ArchivePickupUseCase {
  constructor(
    @Inject(PICKUP_REPOSITORY)
    private readonly pickupRepository: PickupRepository,
  ) {}

  async execute(dto: ArchivePickupDto): Promise<Pickup> {
    const pickup = await this.pickupRepository.findById(dto.pickupId);

    if (!pickup) {
      throw new NotFoundException('Recolección no encontrada');
    }

    const isOwner = pickup.userId === dto.requesterId;
    const isAdmin = dto.requesterRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para eliminar esta recolección',
      );
    }

    const archived = pickup.archive();
    return this.pickupRepository.save(archived);
  }
}
