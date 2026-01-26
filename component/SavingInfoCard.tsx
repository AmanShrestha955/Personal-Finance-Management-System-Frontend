type SavingInfoCardProps = {
  name: string;
  monthPer?: number;
  value: string;
  monthAmount?: number;
};
export default function SavingInfoCard({
  name,
  monthPer,
  value,
  monthAmount,
}: SavingInfoCardProps) {
  return (
    <div className="p-md min-h-[150px] flex-1  rounded-md border bg-card-100 border-card-200 shadow-effect-2 flex flex-col gap-sm font-nunitosans min-w-64">
      <div className="flex flex-row justify-between items-start">
        <h3 className="font-normal text-heading3 leading-[130%] text-text-1000">
          {name}
        </h3>
        {monthPer !== undefined && (
          <p
            className={`font-semibold text-body ${
              monthPer >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {monthPer >= 0 ? "+" : ""}
            {monthPer}%
          </p>
        )}
      </div>
      <h1 className="font-bold text-heading2 text-text-1000">{value}</h1>
      {monthAmount !== undefined && (
        <p
          className={`font-semibold text-body ${
            monthAmount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {monthAmount >= 0 ? "+ " : "- "}Rs{" "}
          {Math.abs(monthAmount).toLocaleString()}
        </p>
      )}
    </div>
  );
}
