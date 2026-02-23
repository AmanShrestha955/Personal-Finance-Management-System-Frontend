import { categoryColors, categoryIcons } from "@/utils/category";
import { useState } from "react";

const AutomatedTransactionsItemCard = ({
  title,
  category,
  amount,
  type,
  frequency,
  isActive,
  onToggle,
  onClick,
}: {
  title: string;
  category: string;
  amount: number;
  type: string;
  frequency: string;
  isActive: boolean;
  onToggle: () => void;
  onClick?: () => void;
}) => {
  const [isOn, setIsOn] = useState(isActive);
  return (
    <div
      onClick={onClick}
      className="flex flex-col p-md gap-md rounded-xl bg-card-100 shadow-effect-2 font-nunitosans hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="flex flex-row gap-md items-center">
        <div
          className="flex justify-center items-center bg-amber-400 rounded-xl size-[48px] text-white"
          style={{
            backgroundColor:
              categoryColors[category as keyof typeof categoryColors],
          }}
        >
          {categoryIcons[category as keyof typeof categoryIcons] &&
            categoryIcons[category as keyof typeof categoryIcons]({})}
        </div>
        <div className="flex flex-col gap-xxs flex-1">
          <h1 className="text-body font-bold text-text-1000">{title}</h1>
          <p className="text-caption text-text-700">{category}</p>
        </div>
        <h1 className="text-heading3 font-bold text-text-1000">
          Rs.{" "}
          {amount.toLocaleString("en-NP", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </h1>
        {/* on off switch button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOn(!isOn);
            onToggle();
          }}
          className={`relative inline-flex items-center w-[40px] h-[24px] rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${
            isOn ? "bg-primary-500" : "bg-card-300"
          }`}
          aria-label="Toggle automation"
        >
          <span
            className={`inline-block w-[18px] h-[18px] bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
              isOn ? "translate-x-[19px]" : "translate-x-[3px]"
            }`}
          />
        </button>
      </div>
      <div className="flex flex-row gap-md items-center">
        <div className="flex flex-col gap-xxs flex-1">
          <p className="text-caption text-text-600">Type</p>
          <p className="text-[14px] text-text-1000 py-xs px-sm rounded-sm bg-card-200 capitalize font-medium">
            {type}
          </p>
        </div>
        <div className="flex flex-col gap-xxs flex-1">
          <p className="text-caption text-text-600">Frequency</p>
          <p className="text-[14px] text-text-1000 py-xs px-sm rounded-sm bg-card-200 capitalize font-medium">
            {frequency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AutomatedTransactionsItemCard;
