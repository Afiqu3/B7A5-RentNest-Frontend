export type LoginState = {
    success : true,
    statusCode : number,
    message : string,
    data : {
        accessToken : string,
        refreshToken : string
    }
}

export type Role = "TENANT" | "LANDLORD";


export type RegistrationState = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
  };
};