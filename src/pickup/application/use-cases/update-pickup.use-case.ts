import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../../../user/domain/user.entity';
import { Pickup, PickupKind, PickupTimeSlot } from '../../domain/pickup.entity';
import {
  PICKUP_REPOSITORY,
  type PickupRepository,
} from '../ports/pickup.repository';

export interface UpdatePickupDto {
  pickupId: string;
  requesterId: string;
  requesterRole: UserRole;
  scheduledAt: Date;
  kind: PickupKind;
  locality: string;
  address: string;
  timeSlot: PickupTimeSlot;
}

@Injectable()
export class UpdatePickupUseCase {
  constructor(
    @Inject(PICKUP_REPOSITORY)
    private readonly pickupRepository: PickupRepository,
  ) {}

  async execute(dto: UpdatePickupDto): Promise<Pickup> {
    const pickup = await this.pickupRepository.findById(dto.pickupId);

    if (!pickup) {
      throw new NotFoundException('Recolección no encontrada');
    }

    const isOwner = pickup.userId === dto.requesterId;
    const isAdmin = dto.requesterRole === UserRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'No tienes permisos para editar esta recolección',
      );
    }

    const updated = pickup.updateDetails({
      scheduledAt: dto.scheduledAt,
      kind: dto.kind,
      locality: dto.locality,
      address: dto.address,
      timeSlot: dto.timeSlot,
    });

    return this.pickupRepository.save(updated);
  }
}
