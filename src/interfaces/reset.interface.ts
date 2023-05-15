export interface IResetToken {
  userId: any;
  token: string;
  createdAt: Date;
}

export interface IUpdatePassword {
  token: string;
  userId: string;
  password: string;
}
