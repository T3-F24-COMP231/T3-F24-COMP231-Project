export interface IActivity {
  _id: string;
  event: string;
  description: string;
  timestamp: string;
  actionBy?: string;
  metaData?: {
    [key: string]: any;
  };
}
