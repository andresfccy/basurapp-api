import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

// Domain
import { UserDocument, UserSchema } from './infrastructure/adapters/persistence/user.schema';

// Application - Use Cases
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { ConfirmEmailUseCase } from './application/use-cases/confirm-email.use-case';

// Application - Ports
import { USER_REPOSITORY } from './application/ports/user.repository';
import { EMAIL_SERVICE } from './application/ports/email.service';

// Infrastructure - Adapters
import { MongooseUserRepository } from './infrastructure/adapters/persistence/mongoose-user.repository';
import { NodemailerEmailService } from './infrastructure/adapters/messaging/nodemailer-email.service';

// Infrastructure - Controllers
import { UserController } from './infrastructure/controllers/user.controller';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [
    // Use Cases
    RegisterUserUseCase,
    ConfirmEmailUseCase,

    // Repositories (Adapters)
    {
      provide: USER_REPOSITORY,
      useClass: MongooseUserRepository,
    },

    // Services (Adapters)
    {
      provide: EMAIL_SERVICE,
      useClass: NodemailerEmailService,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
