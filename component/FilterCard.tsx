import React, { useState } from "react";
import CheckmarkIcon from "./icons/checkmark";
import { categoryWithIcon } from "@/utils/category";
import { Category } from "@/types/type";

export type FilterState = {
  type: "all" | "income" | "expense";
  startDate: string;
  endDate: string;
  categories: Category[];
};

type FilterCardProps = {
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onCancel: () => void;
};

const FilterCard = ({ initialFilters, onApply, onCancel }: FilterCardProps) => {
  // Draft state — only committed to parent on Apply
  const [draft, setDraft] = useState<FilterState>(initialFilters);

  const toggleCategory = (text: Category) => {
    setDraft((prev) => ({
      ...prev,
      categories: prev.categories.includes(text)
        ? prev.categories.filter((c) => c !== text)
        : [...prev.categories, text],
    }));
  };

  return (
    <div className="lg:absolute right-0 top-[130%] flex flex-col items-start gap-md rounded-md border mt-2.5 border-card-200 bg-card-100 py-xl px-lg shadow-effect-3 z-50">
      {/* Type */}
      <div className="flex flex-col gap-sm">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Type
        </p>
        <div className="flex flex-row p-xxs bg-card-200 rounded-sm flex-wrap lg:flex-nowrap">
          {(["all", "expense", "income"] as const).map((t) => (
            <div key={t} className="min-w-36">
              <input
                type="radio"
                name="type"
                id={`type-${t}`}
                className="hidden peer"
                checked={draft.type === t}
                onChange={() => setDraft((prev) => ({ ...prev, type: t }))}
              />
              <label
                htmlFor={`type-${t}`}
                className="block py-xs peer-checked:bg-text-1000 peer-checked:text-text-100 font-nunitosans font-bold leading-[130%] cursor-pointer rounded-sm w-full text-center text-text-1000 duration-300 transition-colors capitalize"
              >
                {t === "all" ? "All" : t === "expense" ? "Expenses" : "Income"}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Date range */}
      <div className="flex flex-col gap-sm w-full">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Date
        </p>
        <div className="flex flex-row flex-wrap gap-xs items-center">
          <input
            type="date"
            value={draft.startDate}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, startDate: e.target.value }))
            }
            className="flex-1 text-body text-text-1000 font-nunitosans font-normal leading-[130%] px-xs py-xs border border-card-200 bg-card-100 rounded-sm shadow-effect-1"
          />
          <p className="font-nunitosans font-bold text-body leading-[130%] text-text-300 text-center">
            –
          </p>
          <input
            type="date"
            value={draft.endDate}
            onChange={(e) =>
              setDraft((prev) => ({ ...prev, endDate: e.target.value }))
            }
            className="flex-1 text-body text-text-1000 font-nunitosans font-normal leading-[130%] px-xs py-xs border border-card-200 bg-card-100 rounded-sm shadow-effect-1"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-sm">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Categories
        </p>
        <div className="flex flex-row flex-wrap gap-2.5">
          {categoryWithIcon.map(({ text, icon: Icon }) => {
            const isSelected = draft.categories.includes(text);
            return (
              <button
                key={text}
                type="button"
                onClick={() => toggleCategory(text)}
                className={`font-nunitosans font-bold text-caption leading-[130%] cursor-pointer flex flex-row gap-xs items-center shadow-effect-1 bg-card-100 px-xs py-xxs rounded-full transition-colors duration-200 ${
                  isSelected ? "text-text-1000" : "text-text-600"
                }`}
              >
                {isSelected ? (
                  <CheckmarkIcon width={16} height={16} />
                ) : (
                  <Icon />
                )}
                {text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row gap-sm justify-end w-full">
        <button
          type="button"
          onClick={onCancel}
          className="border-[0.5px] border-card-200 rounded-sm px-sm min-w-[133px] py-xs text-text-1000 text-body font-nunitosans font-medium leading-[130%] shadow-effect-1"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onApply(draft)}
          className="border-[0.5px] border-card-200 rounded-sm px-sm min-w-[133px] py-xs text-text-100 bg-card-900 text-body font-nunitosans font-medium leading-[130%] shadow-effect-1"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
