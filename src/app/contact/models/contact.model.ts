export interface Contact {
  id: string,
  personal: boolean,
  firstName: string,
  lastName: string,
  dateOfBirth:  string,
  favoritesRanking: number | null,
  phone: Phone,
  address: Address,
  notes: string
}

export interface Phone {
  phoneNumber: string,
  phoneType: string,
}

export interface SaveError {
  type: 'validation' | 'network' | 'server' | 'unknown';
  message: string;
  details?: string;
}

export const phoneTypeValues = [
  {title: 'Mobile', value: 'mobile'},
  {title: 'Work', value: 'work'},
  {title: 'Other', value: 'other'}
]

export const addressTypeValues = [
  {title: 'Home', value: 'home'},
  {title: 'Work', value: 'work'},
  {title: 'Other', value: 'other'}
]
export interface Address {
  streetAddress: string,
  city: string,
  state: string,
  postalCode: string,
  addressType: string,
}

export interface ApiContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Contact[];
}
