export interface ContactFormData {
  content: DataContentUser;
  name:    string;
}

export interface DataContentUser {
  gender:     string;
  birthdate:  Date;
  firstname:  string;
  lastname:   string;
  email:      string;
  address:    string;
  house:      string;
  country:    string;
  department: string;
  city:       string;
  comments:   string;
}