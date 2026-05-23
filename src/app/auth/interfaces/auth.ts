export interface UserLogin {
    email: string,
    password: string
}
export interface AuthToken {
    accessToken: string
}
export interface RegisterData extends UserLogin {
  name: string;
  avatar: Base64URLString;
}

export interface ChangePassword {
    password: string,
    repassword: string
}

export interface SingleRegisterResponse {
    email: string
}

export interface GoogleLogin {
    imageUrl: string | null;
    email: string | null;
    name: string | null;
}