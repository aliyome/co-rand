export interface Room {
  name: string;
  id: string;
  password?: boolean;
  history: History[];
}
export interface History {
  name: string;
  value: number;
  updatedAt?: Date;
}
