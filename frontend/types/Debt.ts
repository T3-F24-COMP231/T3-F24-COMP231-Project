export interface IDebt {
  date: string | number | Date;
  _id: string;
  userId: string;
  title: string;
  amount: number;
  description: string;
}
