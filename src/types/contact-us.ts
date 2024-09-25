export type ContactUsForm = {
  name: string;
  email: string;
  message: string;
};

export type Response = {
  status: Status;
  code: Code;
  message: string;
};

export enum Status {
  SUCCESS = "success",
  BADREQUEST = "bad_request",
}

export enum Code {
  SUCCESS = 200,
  BADREQUEST = 400,
}
