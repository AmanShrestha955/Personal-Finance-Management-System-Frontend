import { TransactionDetail } from "@/types/type";

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
      <p className="font-bold leading-[130%] text-heading3 text-red-600 font-nunitosans">
        {`${amount > 0 ? "+ " : "- "}Rs${amount}`}
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
          <div className="w-[259px] h-[211px] bg-gray-300"></div>
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
