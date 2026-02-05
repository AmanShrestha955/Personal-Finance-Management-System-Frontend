import React from "react";

export default function ExpencesCard({
  category,
  amount,
  icon,
  color,
}: {
  category: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex flex-row justify-between p-xs rounded-md bg-card-100 shadow-effect-2 font-nunitosans font-bold text-body text-text-1000 leading-[130%] items-center">
      <div className="gap-sm flex flex-row items-center">
        <div
          className={`rounded-[10px] w-[48px] h-[48px] justify-center items-center flex text-white`}
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <p>{category}</p>
      </div>
      <p>Rs {amount}</p>
    </div>
  );
}
