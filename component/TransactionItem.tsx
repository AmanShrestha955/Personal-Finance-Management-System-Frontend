"use client";

import EditIcon from "./icons/edit";
import DeleteIcon from "./icons/delete";
import React from "react";
import { useRouter } from "next/navigation";

type TransactionItemProps = {
  _id: string;
  title: string;
  category: string;
  transactionDate: Date;
  type: string;
  amount: number;
  onClick: () => void;
  onDelete: () => void;
  isSelected: boolean;
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  _id,
  title,
  category,
  transactionDate,
  type,
  amount,
  onDelete,
  onClick,
  isSelected,
}: TransactionItemProps) => {
  const router = useRouter();
  const date = new Date(transactionDate);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <tr
      className={`hover:bg-card-200 transition-all duration-500 ${
        isSelected ? "bg-card-200" : "bg-card-100"
      }`}
      onClick={onClick}
    >
      <td className="font-nunitosans py-xs">
        <div className="flex flex-col gap-xxs px-xs">
          <div className="font-bold text-body text-text-1000 leading-[130%]">
            {title}
          </div>
          <div className="font-normal text-caption text-text-500 leading-[130%]">
            {category}
          </div>
        </div>
      </td>
      <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
        {formattedDate}
      </td>
      <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
        {type}
      </td>
      <td
        className={`font-nunitosans font-bold text-body ${
          type === "expense" ? "text-red-600" : "text-green-600"
        } leading-[130%] py-xs`}
      >
        {type === "expense" ? "- " : "+ "}
        {amount}
      </td>
      <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
        <div className="flex-1 flex flex-row gap-lg justify-start">
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/dashboard/transaction-management/add-transaction?id=${_id}`
              );
            }}
          >
            <EditIcon className="w-[18px] h-[18px] text-text-600" />
          </button>
          <button
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  "Are you sure you want to delete this transaction?"
                )
              ) {
                onDelete();
              }
            }}
          >
            <DeleteIcon className="w-[18px] h-[18px] text-text-600" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TransactionItem;
