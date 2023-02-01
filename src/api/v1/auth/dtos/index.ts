import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

class SignUpDto {
  @IsDefined()
  @IsString()
  public email: string;

  @IsDefined()
  @IsString()
  @MinLength(8, {
    message: 'Password is too short',
  })
  @MaxLength(15, {
    message: 'Password is too long',
  })
  public password: string;
}

class RefreshTokenDto {
  @IsDefined()
  @IsString()
  public refreshToken: string;
}

const AuthDto = {
  SignUpDto,
  RefreshTokenDto,
};

export default AuthDto;
