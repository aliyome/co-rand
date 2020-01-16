export interface Room {
  id: string;
  name: string;
  password?: boolean;
  history: History[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface History {
  name: string;
  value: number;
  updatedAt?: Date;
}
