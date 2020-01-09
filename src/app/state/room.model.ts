export interface Room {
  id: number | string;
  name: string;
  password?: boolean;
  history: History[];
  updatedAt?: Date;
}
export interface History {
  name: string;
  value: number;
  updatedAt?: Date;
}

export function createRoom(params: Partial<Room>) {
  return {
    ...params,
  } as Room;
}
