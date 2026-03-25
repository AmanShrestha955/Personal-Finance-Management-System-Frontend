import { TransactionDetail } from "@/types/type";
import Image from "next/image";
import { useEffect } from "react";

const TransactionDetailCard = ({
  title,
  category,
  transactionDate,
  amount,
  type,
  description,
  receipt,
  note,
}: TransactionDetail) => {
  useEffect(() => {
    console.log("Receipt URL:", receipt);
    console.log("Environment Variable:", process.env.NEXT_PUBLIC_API_URL);
    console.log(
      "Full Receipt URL:",
      `${process.env.NEXT_PUBLIC_BASE_URL}${receipt}`,
    );
  }, [receipt]);

  const date = new Date(transactionDate);
  return (
    <div className="flex flex-col px-lg py-md gap-md bg-card-100 rounded-md border border-card-200 shadow-effect-2 min-w-100 max-w-[420px]">
      <h2 className="font-nunitosans font-bold text-heading3 leading-[130%] text-text-1000">
        Transactions Detail
      </h2>
      <p className="font-bold leading-[130%] text-body text-text-1000 font-nunitosans capitalize">
        {title}
      </p>
      <p className="font-bold leading-[130%] text-body text-text-1000 font-nunitosans">
        {date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <p
        className={`font-bold leading-[130%] text-heading3 ${
          type === "expense" ? "text-red-600" : "text-green-600"
        } font-nunitosans`}
      >
        {`${type === "expense" ? "- " : "+ "}Rs${amount}`}
      </p>
      <div className="flex flex-row gap-sm">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Catogory :
        </p>
        <p className="font-nunitosans font-medium text-body text-text-1000 leading-[130%]">
          {category}
        </p>
      </div>
      <div className="flex flex-row gap-sm">
        <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%]">
          Transaction Type :
        </p>
        <p className="font-nunitosans font-medium text-body text-text-1000 leading-[130%] capitalize">
          {type}
        </p>
      </div>
      {description ? (
        <div className="flex flex-row gap-sm">
          <p className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] shrink-0">
            Description :
          </p>
          <p className="font-nunitosans font-medium text-body text-text-1000 leading-[130%] capitalize">
            {description}
          </p>
        </div>
      ) : null}
      {receipt ? (
        <>
          <p className="font-bold leading-[130%] text-body text-text-1000 font-nunitosans">
            Receipt
          </p>
          <div className="w-[259px] h-[211px] bg-gray-300">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${receipt}`}
              alt="receipt"
              width={259}
              height={211}
              className="object-cover rounded-md"
              unoptimized
            />
          </div>
        </>
      ) : null}
      {note ? (
        <div className="flex flex-col gap-sm p-sm rounded-sm bg-card-200 shadow-effect-2">
          <p className="font-bold leading-[130%] text-body text-text-1000 font-nunitosans">
            Notes
          </p>
          <p className="font-medium leading-[130%] text-body text-text-1000 font-nunitosans capitalize">
            {note}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default TransactionDetailCard;
