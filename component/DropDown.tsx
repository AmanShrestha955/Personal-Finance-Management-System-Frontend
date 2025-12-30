"use client";
import DropDownIcon from "./icons/dropdown";
import { DropDownProps, OptionWithIcon, OptionWithoutIcon } from "@/types/type";

const DropDown = <T extends OptionWithIcon | OptionWithoutIcon>({
  options,
  selectedOption,
  onSelect,
  isOpen,
  onToggle,
}: DropDownProps<T>) => {
  const onPressOption = (index: number) => {
    onSelect(options[index]);
  };
  return (
    <div className="relative">
      <button
        className={`w-full flex flex-row gap-xs p-xs shadow-effect-2 items-center cursor-pointer border-[0.5px] rounded-sm border-card-200 ${
          isOpen ? "bg-card-200" : "bg-card-100"
        }  transition-colors duration-300`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
      >
        {"icon" in selectedOption && selectedOption.icon}
        <p className="flex-1 font-nunitosans font-medium leading-[130%] text-text-1000 text-body text-left">
          {selectedOption.text}
        </p>
        <DropDownIcon width={16} height={16} rotate={isOpen ? 90 : 0} />
      </button>
      {isOpen && (
        <div className="flex flex-col gap-0 w-full bg-card-100 rounded-sm shadow-effect-2 absolute top-[120%] left-0">
          {options.map((option, index) => {
            return (
              <div
                key={index}
                className={`flex flex-row gap-xs p-xs bg-card-100 hover:bg-card-200 ${
                  index === 0
                    ? "rounded-t-sm"
                    : index === options.length - 1
                    ? "rounded-b-sm"
                    : ""
                } cursor-pointer transition-all duration-200`}
                onClick={() => {
                  onPressOption(index);
                }}
              >
                {"icon" in option && option.icon}
                <p className="flex-1 font-bold font-nunitosans text-text-1000 text-body leading-[130%]">
                  {option.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropDown;
