import { NextPage } from "next";
import React, { InputHTMLAttributes, ReactNode } from "react";

interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "name" | "type" | "prefix" | "suffix"
  > {
  name?: string; // Required
  type: "text" | "number" | "email" | "password" | "date"; // Required with specific types
  prefix?: ReactNode; // For icons or text before input (like Rs, $)
  placeholder?: string; // Optional placeholder
  suffix?: ReactNode; // For icons or text after input (like show/hide icon)
}

const Input: NextPage<InputProps> = ({
  name,
  type,
  prefix,
  placeholder,
  suffix,
  ...props
}: InputProps) => {
  return (
    <div className="flex items-center bg-card-100 border border-text-300 rounded-sm p-xs gap-xs">
      {prefix && (
        <span className="font-nunitosans text-body font-medium text-text-600 leading-[130%]">
          {prefix}
        </span>
      )}
      <input
        type={type}
        name={name}
        {...props}
        placeholder={placeholder}
        className="font-nunitosans flex-1 text-body font-medium text-text-1000 leading-[130%] outline-none"
      />
      {suffix && (
        <span className="font-nunitosans text-body font-medium text-text-600 leading-[130%]">
          {suffix}
        </span>
      )}
    </div>
  );
};

export default Input;
