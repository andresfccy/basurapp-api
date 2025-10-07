import { Pickup } from '../../domain/pickup.entity';

export interface PickupRepository {
  save(pickup: Pickup): Promise<Pickup>;
  findById(id: string): Promise<Pickup | null>;
  findByUserId(userId: string): Promise<Pickup[]>;
  findByStaffUsername(username: string): Promise<Pickup[]>;
  findAll(): Promise<Pickup[]>;
}

export const PICKUP_REPOSITORY = Symbol('PICKUP_REPOSITORY');
