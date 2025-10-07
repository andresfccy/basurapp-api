import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  PickupKind,
  PickupStatus,
  PickupTimeSlot,
} from '../../../domain/pickup.entity';

@Schema({
  collection: 'pickups',
  timestamps: true,
})
export class PickupDocument {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  userId!: string;

  @Prop({ required: true })
  requesterName!: string;

  @Prop({ required: true })
  requesterEmail!: string;

  @Prop({ required: true })
  scheduledAt!: Date;

  @Prop({ required: true, enum: Object.values(PickupStatus) })
  status!: PickupStatus;

  @Prop({ required: true, enum: Object.values(PickupKind) })
  kind!: PickupKind;

  @Prop({ required: true })
  locality!: string;

  @Prop({ required: true })
  address!: string;

  @Prop({ required: true, enum: Object.values(PickupTimeSlot) })
  timeSlot!: PickupTimeSlot;

  @Prop({ default: null })
  staffName!: string | null;

  @Prop({ default: null })
  staffUsername!: string | null;

  @Prop({ default: null })
  staffUsernameNormalized!: string | null;

  @Prop({ type: Number, default: null })
  collectedWeightKg!: number | null;

  @Prop({ default: false })
  archived!: boolean;

  @Prop({ default: null })
  completedAt!: Date | null;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export type PickupDocumentModel = HydratedDocument<PickupDocument>;
export const PickupSchema = SchemaFactory.createForClass(PickupDocument);
