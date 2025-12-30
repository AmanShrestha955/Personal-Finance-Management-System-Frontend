"use client";
import DropDown from "@/component/DropDown";
import TagIcon from "@/component/icons/tag";
import Input from "@/component/Input";
import Tag from "@/component/Tag";
import { NextPage } from "next";
import { useState } from "react";

// interface Props {}

const Page: NextPage = ({}) => {
  const categoryOptions = [
    { text: "Food", icon: <></> },
    { text: "Transport", icon: <></> },
    { text: "Shopping", icon: <></> },
    { text: "Bills", icon: <></> },
    { text: "Entertainment", icon: <></> },
  ];
  const defaultCategorySelectedOption = {
    text: "Select Category",
    icon: <></>,
  };
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    defaultCategorySelectedOption
  );

  const paymentOptions = [
    { text: "Cash" },
    { text: "Credit Card" },
    { text: "Debit Card" },
    { text: "e-Wallet" },
  ];
  const defaultPaymentSelectedOption = { text: "Select Payment Method" };
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    defaultPaymentSelectedOption
  );

  const [selectedTags, setSelectedTags] = useState<string[]>(["tag1", "tag2"]);
  const recentTags = ["recenttag1", "recenttag2", "recenttag3", "recenttag4"];
  const selectTagFun = (tag: string) => {
    if (selectedTags.includes(tag)) {
      return;
    }
    setSelectedTags([...selectedTags, tag]);
  };
  const removeTagFun = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };
  return (
    <div className="flex flex-row gap-md mr-[32px]">
      <form className="flex-1 flex flex-col gap-lg">
        <h1 className="font-sansation mt-8 font-bold text-heading text-text-1000 leading-[130%]">
          Transaction Details
        </h1>
        {/* basic details */}
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Basic Details
          </h3>
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Title
            </p>
            <Input
              placeholder="eg: Food with Family"
              type="text"
              name="title"
            />
          </div>
          <div className="flex flex-row gap-md">
            {/* transaction type */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Transaction Type
              </p>
              <div className="flex flex-row p-xxs bg-card-200 rounded-sm">
                <div className="flex-1 min-w-36 max-w-full">
                  <input
                    type="radio"
                    name="transaction-type"
                    id="expenses"
                    className="hidden peer"
                    defaultChecked
                  />
                  <label
                    htmlFor="expenses"
                    className="block py-xxs peer-checked:bg-text-1000 peer-checked:text-text-100 font-nunitosans font-bold leading-[130%] cursor-pointer rounded-sm w-full text-center text-text-1000 duration-300 transition-colors"
                  >
                    Expenses
                  </label>
                </div>
                <div className="flex-1 min-w-36 max-w-full">
                  <input
                    type="radio"
                    name="transaction-type"
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
            {/* amount */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Amount
              </p>
              <Input
                placeholder="0.00"
                type="number"
                name="amount"
                prefix="Rs"
              />
            </div>
          </div>
          {/* Date */}
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Date
            </p>
            <Input placeholder="" type="date" name="date" />
          </div>
        </div>
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Categorization
          </h3>
          <div className="flex flex-row gap-md">
            {/* categories */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Categories
              </p>
              <DropDown
                options={categoryOptions}
                selectedOption={selectedCategory}
                onSelect={(option) => {
                  setSelectedCategory(option);
                  setIsCategoryDropdownOpen(false);
                }}
                isOpen={isCategoryDropdownOpen}
                onToggle={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
              />
            </div>
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Payment Method
              </p>
              <DropDown
                options={paymentOptions}
                selectedOption={selectedPaymentMethod}
                onSelect={(option) => {
                  setSelectedPaymentMethod(option);
                  setIsPaymentDropdownOpen(false);
                }}
                isOpen={isPaymentDropdownOpen}
                onToggle={() =>
                  setIsPaymentDropdownOpen(!isPaymentDropdownOpen)
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-medium">
              Description
            </p>
            <Input
              placeholder="What was this transaction for?"
              type="text"
              name="description"
            />
          </div>
        </div>
        <div className="flex flex-col gap-sm">
          <h3 className="font-nunitosans font-bold text-text-1000 text-heading3 leading-[130%]">
            Optional Details
          </h3>
          <div className="flex flex-row gap-md">
            {/* tags */}
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Tags
              </p>
              <div className="flex flex-row flex-wrap gap-md">
                {selectedTags.map((tag, index) => (
                  <Tag
                    text={tag}
                    isSelected={true}
                    key={index}
                    removeTag={() => removeTagFun(tag)}
                  />
                ))}
              </div>
              <Input
                placeholder="Add tags (press Enter)"
                type="text"
                name="tags"
                prefix={<TagIcon className="text-text-500" />}
                suffix={<TagIcon className="text-text-1000" />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const newTag = input.value.trim();

                    if (newTag && !selectedTags.includes(newTag)) {
                      setSelectedTags([...selectedTags, newTag]);
                      input.value = ""; // Clear input after adding
                    }
                  }
                }}
              />
            </div>
            <div className="flex-1 flex flex-col gap-xxs">
              <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
                Receipt
              </p>
              <button className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150">
                Upload Receipt
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Recent Tags
            </p>
            <div className="flex flex-row flex-wrap gap-md">
              {recentTags.map((tag, index) => (
                <Tag
                  key={index}
                  text={tag}
                  isSelected={false}
                  selectTag={() => selectTagFun(tag)}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-xxs">
            <p className="text-text-1000 text-body leading-[130%] font-nunitosans font-bold">
              Notes
            </p>
            <textarea
              placeholder="Any additional notes?"
              rows={3}
              className="bg-card-100 p-xs rounded-sm border border-text-300"
            />
          </div>
        </div>
        {/* button */}
        <div className="flex flex-row justify-end items-center gap-md">
          <button className="font-nunitosans font-bold text-text-100 text-body py-xs px-md rounded-sm bg-primary-500 hover:bg-primary-600 active:bg-primary-800 shadow-effect-2 transition-all duration-150">
            Save Transaction
          </button>
          <button className="font-nunitosans font-bold text-text-1000 text-body py-xs px-md rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 shadow-effect-2 transition-all duration-150">
            Cancle
          </button>
        </div>
      </form>
      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-md py-lg px-md w-[442px] min-w-[300px] rounded-md bg-card-200">
          <h4 className="font-nunitosans font-bold text-text-1000 text-heading3">
            Transaction Summary
          </h4>
          <p className="font-nunitosans text-text-1000">
            After this transaction: <b>Balance = $1,232.34</b>
          </p>
        </div>
        <div className="flex flex-col gap-md py-lg px-md max-w-[442px] rounded-md border border-green-400 bg-green-200">
          <h4 className="font-nunitosans font-bold text-text-1000 text-heading3">
            Budget Status
          </h4>
          <div className="flex flex-col gap-xxs">
            <p className="font-nunitosans font-normal text-text-1000">
              You’ve spent $120 of your $1,326.34 Food budget.
            </p>
            <p className="font-nunitosans font-bold text-text-1000">
              Remaining: $1,206.34.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
