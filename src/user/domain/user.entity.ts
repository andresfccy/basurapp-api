export enum UserRole {
  BASIC = 'basic',
  ADMIN = 'admin',
  COLLECTOR = 'collector',
}

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly phone: string,
    public readonly role: UserRole,
    public readonly passwordHash: string,
    public readonly status: UserStatus,
    public readonly emailVerificationCode?: string,
    public readonly emailVerificationExpiry?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  get displayName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isEmailVerified(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  isVerificationCodeValid(code: string): boolean {
    if (!this.emailVerificationCode || !this.emailVerificationExpiry) {
      return false;
    }

    if (this.emailVerificationCode !== code) {
      return false;
    }

    return new Date() <= this.emailVerificationExpiry;
  }

  static create(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    role: UserRole,
    passwordHash: string,
    verificationCode: string,
  ): User {
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // 24 horas

    return new User(
      id,
      email,
      firstName,
      lastName,
      phone,
      role,
      passwordHash,
      UserStatus.PENDING,
      verificationCode,
      verificationExpiry,
    );
  }

  markAsVerified(): User {
    return new User(
      this.id,
      this.email,
      this.firstName,
      this.lastName,
      this.phone,
      this.role,
      this.passwordHash,
      UserStatus.ACTIVE,
      undefined,
      undefined,
      this.createdAt,
      new Date(),
    );
  }
}
