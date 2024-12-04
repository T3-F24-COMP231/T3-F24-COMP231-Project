export interface IDebt {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  description: string;
  date: Date;
  paymentReminder: {
    enabled: boolean;
    amountToPay: number;
    reminderFrequency: "daily" | "weekly" | "monthly";
    reminderDate: Date;
  };
}

