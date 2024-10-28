export type ICreateExpensePayload = {
  date: Date;
  name: string;
  group: string;
  subgroup: string;
  description?: string;
  sum: number;
}

export type IGetExpenseQuery = {
  id?: string;
  start_timestamp?: string;
  end_timestamp?: string;
  name?: string;
  group?: string;
  subgroup?: string;
}
