export interface ISaving {
  _id: string;
  userId: string;
  purpose: string;
  goalAmount: number;
  savedAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
