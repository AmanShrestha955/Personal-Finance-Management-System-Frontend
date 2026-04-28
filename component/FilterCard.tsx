import React, { useState } from "react";
import SavingIcon from "./icons/saving";
import CheckmarkIcon from "./icons/checkmark";
import { categoryWithIcon } from "@/utils/category";
import { Category } from "@/types/type";

const FilterCard = ({}) => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);

  const toggleCategory = (text: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(text) ? prev.filter((c) => c !== text) : [...prev, text],
    );
  };
  return (
    <div className="absolute right-0 top-[130%] flex flex-col items-start gap-md rounded-md border border-card-200 bg-card-100 py-xl px-lg shadow-effect-3">
      <div className="flex flex-col gap-sm">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Type
        </p>
        <div className="flex flex-row p-xxs bg-card-200 rounded-sm">
          <div className="min-w-36">
            <input
              type="radio"
              name="type"
              id="all"
              className="hidden peer"
              defaultChecked={true}
            />
            <label
              htmlFor="all"
              className="block py-xxs peer-checked:bg-text-1000 peer-checked:text-text-100 font-nunitosans font-bold leading-[130%] cursor-pointer rounded-sm w-full text-center text-text-1000 duration-300 transition-colors"
            >
              All
            </label>
          </div>
          <div className="min-w-36">
            <input
              type="radio"
              name="type"
              id="expenses"
              className="hidden peer"
            />
            <label
              htmlFor="expenses"
              className="block py-xxs peer-checked:bg-text-1000 peer-checked:text-text-100 font-nunitosans font-bold leading-[130%] cursor-pointer rounded-sm w-full text-center text-text-1000 duration-300 transition-colors"
            >
              Expenses
            </label>
          </div>
          <div className="min-w-36">
            <input
              type="radio"
              name="type"
              id="income"
              className="hidden peer"
            />
            <label
              htmlFor="income"
              className="block py-xxs peer-checked:bg-text-1000 peer-checked:text-text-100 font-nunitosans font-bold leading-[130%] cursor-pointer rounded-sm w-full text-center text-text-1000 duration-300 transition-colors"
            >
              Income
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-sm w-full">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Date
        </p>
        <div className="flex flex-row gap-xs">
          <input
            type="date"
            name="from"
            className="flex-1 text-body text-text-1000 font-nunitosans font-normal leading-[130%] px-xs py-xxs border border-card-200 bg-card-100 rounded-sm shadow-effect-1"
            id=""
          />
          <p className="font-nunitosans font-bold text-body leading-[130%] text-text-300 text-center">
            _
          </p>
          <input
            type="date"
            name="to"
            id=""
            className="flex-1 text-body text-text-1000 font-nunitosans font-normal leading-[130%] px-xs py-xxs border border-card-200 bg-card-100 rounded-sm shadow-effect-1"
          />
        </div>
      </div>
      <div className="flex flex-col gap-sm">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Categories
        </p>
        <div className="flex flex-row flex-wrap gap-2.5">
          <input
            type="checkbox"
            name="categories"
            id="categorie"
            className="hidden peer"
          />
          {categoryWithIcon.map(({ text, icon: Icon }) => {
            const isSelected = selectedCategories.includes(text);
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
      <div className="flex flex-row gap-sm justify-end w-full">
        <button className="border-[0.5px] border-card-200 rounded-sm px-sm min-w-[133px] py-xxs text-text-1000 text-body font-nunitosans font-medium leading-[130%] shadow-effect-1">
          Cancel
        </button>
        <button className="border-[0.5px] border-card-200 rounded-sm px-sm min-w-[133px] py-xxs text-text-100 bg-card-900 text-body font-nunitosans font-medium leading-[130%] shadow-effect-1">
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterCard;
