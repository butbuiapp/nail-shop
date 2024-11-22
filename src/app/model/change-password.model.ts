export interface ChangePasswordDto {
  phoneNumber: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}