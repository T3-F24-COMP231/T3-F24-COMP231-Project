import { IRole } from "./Role";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  assignedExpert?: string;
  assignedClients?: string[];
}
