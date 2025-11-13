export type SignInForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SignUpForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginData = {
  token: string;
  message: string;
};
