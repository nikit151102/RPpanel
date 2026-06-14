export interface Store {
  id: string;
  uuid1C: string;
  name1C: string;
  addressId: string;
  address: Address;
  code: string;
  storeScheduleId: string;
  isActive: boolean;
}

export interface Address {
  id: string;
  address1c: string;
  country: string;
  region: string;
  area: string;
  city: string;
  street: string;
  house: string;
  housing: string;
  floorNumber: string;
  office: string;
  postIndex: string;
  latitude: number;
  longitude: number;
  system: string;
}

export interface StoreCreateDto {
  uuid1C: string;
  name1C: string;
  addressId: string;
  address: AddressCreateDto;
  code: string;
  storeScheduleId: string;
}

export interface AddressCreateDto {
  address1c: string;
  country: string;
  region: string;
  area: string;
  city: string;
  street: string;
  house: string;
  housing: string;
  floorNumber: string;
  office: string;
  postIndex: string;
  latitude: number;
  longitude: number;
  system: string;
}
