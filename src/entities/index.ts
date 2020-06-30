export * from './user';

export interface Entity {
  id: string;

  createdAt?: Date;
  updatedAt?: Date;
}
