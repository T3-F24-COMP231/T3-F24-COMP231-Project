export interface IExpense {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
}
