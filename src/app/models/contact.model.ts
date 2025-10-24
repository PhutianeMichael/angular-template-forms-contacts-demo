export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface ApiContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Contact[];
}
