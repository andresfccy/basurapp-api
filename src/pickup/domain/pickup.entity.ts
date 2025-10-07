export enum PickupStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum PickupKind {
  ORGANICO = 'organico',
  INORGANICOS = 'inorganicos',
  PELIGROSOS = 'peligrosos',
}

export enum PickupTimeSlot {
  MORNING = '08:00 - 12:00',
  NOON = '12:00 - 16:00',
  EVENING = '16:00 - 20:00',
}

export type PickupProps = {
  id: string;
  userId: string;
  requesterName: string;
  requesterEmail: string;
  scheduledAt: Date;
  status: PickupStatus;
  kind: PickupKind;
  locality: string;
  address: string;
  timeSlot: PickupTimeSlot;
  staffName: string | null;
  staffUsername: string | null;
  collectedWeightKg: number | null;
  archived: boolean;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class Pickup {
  private constructor(private readonly props: PickupProps) {}

  static schedule(params: {
    id: string;
    userId: string;
    requesterName: string;
    requesterEmail: string;
    scheduledAt: Date;
    kind: PickupKind;
    locality: string;
    address: string;
    timeSlot: PickupTimeSlot;
  }): Pickup {
    const now = new Date();
    return new Pickup({
      id: params.id,
      userId: params.userId,
      requesterName: params.requesterName,
      requesterEmail: params.requesterEmail,
      scheduledAt: params.scheduledAt,
      status: PickupStatus.PENDING,
      kind: params.kind,
      locality: params.locality,
      address: params.address,
      timeSlot: params.timeSlot,
      staffName: null,
      staffUsername: null,
      collectedWeightKg: null,
      archived: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static restore(props: PickupProps): Pickup {
    return new Pickup(props);
  }

  private clone(overrides: Partial<PickupProps>): Pickup {
    const now = new Date();
    return new Pickup({
      ...this.props,
      ...overrides,
      updatedAt: overrides.updatedAt ?? now,
    });
  }

  markCompleted(params: {
    completedAt: Date;
    collectedWeightKg: number | null;
  }): Pickup {
    return this.clone({
      status: PickupStatus.COMPLETED,
      completedAt: params.completedAt,
      collectedWeightKg: params.collectedWeightKg,
      scheduledAt: params.completedAt,
    });
  }

  archive(): Pickup {
    return this.clone({ archived: true });
  }

  updateDetails(params: {
    scheduledAt: Date;
    kind: PickupKind;
    locality: string;
    address: string;
    timeSlot: PickupTimeSlot;
  }): Pickup {
    return this.clone({
      scheduledAt: params.scheduledAt,
      kind: params.kind,
      locality: params.locality,
      address: params.address,
      timeSlot: params.timeSlot,
    });
  }

  assignStaff(params: {
    staffName: string;
    staffUsername: string | null;
  }): Pickup {
    return this.clone({
      staffName: params.staffName,
      staffUsername: params.staffUsername,
    });
  }

  toPrimitives(): PickupProps {
    return { ...this.props };
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get requesterName(): string {
    return this.props.requesterName;
  }

  get requesterEmail(): string {
    return this.props.requesterEmail;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get status(): PickupStatus {
    return this.props.status;
  }

  get kind(): PickupKind {
    return this.props.kind;
  }

  get locality(): string {
    return this.props.locality;
  }

  get address(): string {
    return this.props.address;
  }

  get timeSlot(): PickupTimeSlot {
    return this.props.timeSlot;
  }

  get staffName(): string | null {
    return this.props.staffName;
  }

  get staffUsername(): string | null {
    return this.props.staffUsername;
  }

  get collectedWeightKg(): number | null {
    return this.props.collectedWeightKg;
  }

  get archived(): boolean {
    return this.props.archived;
  }

  get completedAt(): Date | null {
    return this.props.completedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
