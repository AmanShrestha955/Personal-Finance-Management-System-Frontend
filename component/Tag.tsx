import { XIcon } from "lucide-react";

const Tag = ({
  text,
  isSelected,
  selectTag = () => console.log("select Tag function inside tag file."),
  removeTag = () => console.log("remove Tag function inside tag file."),
}: {
  text: string;
  isSelected: boolean;
  selectTag?: () => void;
  removeTag?: () => void;
}) => {
  return (
    <div
      className={`flex flex-row gap-xxs cursor-pointer items-center px-xs py-xxs ${
        isSelected ? "bg-tag-1" : "bg-card-200"
      } rounded-full`}
      onClick={isSelected ? removeTag : selectTag}
    >
      <p className="font-nunitosans font-medium text-caption text-text-1000">
        {text}
      </p>
      {isSelected ? <XIcon size={16} /> : null}
    </div>
  );
};

export default Tag;
