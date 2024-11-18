export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "Finance Tracker" | "Debt Repayer" | "Financial Expert" | "Investor" | "Administrator";
  assignedExpert?: string;
  assignedClients?: string;
}
