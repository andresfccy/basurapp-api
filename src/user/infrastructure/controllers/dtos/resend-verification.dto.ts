import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationRequestDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;
}
