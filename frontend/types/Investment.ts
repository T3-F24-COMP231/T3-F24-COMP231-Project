export interface IInvestment {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  description: string;
  category: string;
  returnPercentage: number;
  date: Date;
}
