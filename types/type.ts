import { JSX } from "react";

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
  token?: string;
  message: string;
  error?: string;
};

export type SignUpData = {
  message: string;
  error?: string;
};

export type TransactionDetail = {
  _id: string;
  userId: string;
  accountId: string;
  title: string;
  amount: number;
  category: string;
  transactionDate: Date;
  description?: string;
  type: string;
  note?: string;
  receipt?: string;
  tags?: string[];
};

export type OptionWithIcon = { text: string; icon: JSX.Element };
export type OptionWithoutIcon = { text: string };
export type DropDownProps<T> = {
  options: T[];
  selectedOption: T;
  onSelect: (option: T) => void;
  isOpen: boolean;
  onToggle: () => void;
};
