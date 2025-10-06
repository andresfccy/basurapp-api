import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserStatus } from '../../../domain/user.entity';

@Schema({ collection: 'users', timestamps: true })
export class UserDocument extends Document {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true, enum: Object.values(UserRole) })
  role: UserRole;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: Object.values(UserStatus) })
  status: UserStatus;

  @Prop()
  emailVerificationCode?: string;

  @Prop()
  emailVerificationExpiry?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
