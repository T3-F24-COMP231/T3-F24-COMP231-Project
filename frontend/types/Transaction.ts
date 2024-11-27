export interface ITransaction {
    _id: string;
    title: string;
    amount: number;
    description: string;
    type: "income" | "debt" | "expense" | "investment";
    createdAt: string;
  }