import { AddressType as Address } from './address-type.js';

export type UserType = {
  id: string;
  name: string;
  email: string;
  password: string;
  birthDate: string;
  createdAt: Date;
  updatedAt: Date;
  addresses: Address[];
};
