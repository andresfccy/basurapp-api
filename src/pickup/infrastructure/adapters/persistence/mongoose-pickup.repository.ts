import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pickup } from '../../../domain/pickup.entity';
import type { PickupProps } from '../../../domain/pickup.entity';
import { PickupRepository } from '../../../application/ports/pickup.repository';
import { PickupDocument } from './pickup.schema';
import type { PickupDocumentModel } from './pickup.schema';

@Injectable()
export class MongoosePickupRepository implements PickupRepository {
  constructor(
    @InjectModel(PickupDocument.name)
    private readonly pickupModel: Model<PickupDocumentModel>,
  ) {}

  async save(pickup: Pickup): Promise<Pickup> {
    const data = this.toDocument(pickup);

    const updated = await this.pickupModel
      .findOneAndUpdate({ id: pickup.id }, data, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
      .exec();

    return this.toDomain(updated);
  }

  async findById(id: string): Promise<Pickup | null> {
    const doc = await this.pickupModel.findOne({ id }).exec();
    return doc ? this.toDomain(doc) : null;
  }

  async findByUserId(userId: string): Promise<Pickup[]> {
    const docs = await this.pickupModel.find({ userId }).exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findByStaffUsername(username: string): Promise<Pickup[]> {
    const normalized = username.trim().toLowerCase();
    const docs = await this.pickupModel
      .find({ staffUsernameNormalized: normalized })
      .exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  async findAll(): Promise<Pickup[]> {
    const docs = await this.pickupModel.find().exec();
    return docs.map((doc) => this.toDomain(doc));
  }

  private toDomain(doc: PickupDocument): Pickup {
    return Pickup.restore({
      id: doc.id,
      userId: doc.userId,
      requesterName: doc.requesterName,
      requesterEmail: doc.requesterEmail,
      scheduledAt: doc.scheduledAt,
      status: doc.status,
      kind: doc.kind,
      locality: doc.locality,
      address: doc.address,
      timeSlot: doc.timeSlot,
      staffName: doc.staffName,
      staffUsername: doc.staffUsername,
      collectedWeightKg: doc.collectedWeightKg,
      archived: doc.archived,
      completedAt: doc.completedAt,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toDocument(pickup: Pickup): Partial<PickupProps> & {
    staffUsernameNormalized: string | null;
  } {
    const data = pickup.toPrimitives();
    return {
      ...data,
      staffUsernameNormalized: data.staffUsername
        ? data.staffUsername.trim().toLowerCase()
        : null,
    };
  }
}
