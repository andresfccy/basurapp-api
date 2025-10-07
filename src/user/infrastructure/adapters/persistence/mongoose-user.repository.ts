import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../../domain/user.entity';
import { UserRepository } from '../../../application/ports/user.repository';
import { UserDocument } from './user.schema';

@Injectable()
export class MongooseUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async save(user: User): Promise<User> {
    const userDoc = new this.userModel(this.toDocument(user));
    await userDoc.save();
    return this.toDomain(userDoc);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ id }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email }).exec();
    return userDoc ? this.toDomain(userDoc) : null;
  }

  async update(user: User): Promise<User> {
    const updated = await this.userModel
      .findOneAndUpdate({ id: user.id }, this.toDocument(user), { new: true })
      .exec();

    if (!updated) {
      throw new Error('User not found');
    }

    return this.toDomain(updated);
  }

  async updateVerificationCode(
    userId: string,
    verificationCode: string,
  ): Promise<void> {
    await this.userModel
      .updateOne(
        { id: userId },
        {
          emailVerificationCode: verificationCode,
          emailVerificationExpiry: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        },
      )
      .exec();
  }

  async delete(id: string): Promise<void> {
    await this.userModel.deleteOne({ id }).exec();
  }

  private toDomain(doc: UserDocument): User {
    return new User(
      doc.id,
      doc.email,
      doc.firstName,
      doc.lastName,
      doc.phone,
      doc.role,
      doc.passwordHash,
      doc.status,
      doc.emailVerificationCode,
      doc.emailVerificationExpiry,
      doc.createdAt,
      doc.updatedAt,
    );
  }

  private toDocument(user: User): Partial<UserDocument> {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      passwordHash: user.passwordHash,
      status: user.status,
      emailVerificationCode: user.emailVerificationCode,
      emailVerificationExpiry: user.emailVerificationExpiry,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
