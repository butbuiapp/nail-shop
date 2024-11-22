export interface LoginRequestDto {
  phoneNumber: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  expiresIn: string;
}