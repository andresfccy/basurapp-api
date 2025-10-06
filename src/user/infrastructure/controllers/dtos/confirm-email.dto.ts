import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class ConfirmEmailRequestDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString({ message: 'El código debe ser un texto' })
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  verificationCode: string;
}
