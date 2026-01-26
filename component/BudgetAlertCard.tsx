import { useRouter } from "next/navigation";
import WalletIcon from "./icons/wallet";

export function BudgetAlertCard({
  id,
  spentAmount,
  budgetAmount,
  category,
}: {
  id: string;
  spentAmount: number;
  budgetAmount: number;
  category: string;
}) {
  const navigation = useRouter();
  const percentage = Math.min((spentAmount / budgetAmount) * 100, 100);
  return (
    <div
      className="flex-1 min-w-[314px] p-md rounded-lg border cursor-pointer hover:scale-[1.03] border-card-200 shadow-effect-2 bg-card-100 flex flex-col gap-sm transition-all duration-300"
      onClick={() => {
        navigation.push(`/dashboard/transaction-management/add-alert?id=${id}`);
      }}
    >
      <div className="flex flex-row justify-between items-center">
        <p className="font-nunitosans font-normal text-heading3 leading-[130%] text-text-1000">
          {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
        </p>
        <WalletIcon />
      </div>
      <div className="flex flex-row justify-between items-center">
        <p className="font-nunitosans font-normal text-body leading-[130%] text-text-1000">
          Spend:
          <span className="font-bold"> NPR {spentAmount}</span>
        </p>
        <p className="font-nunitosans font-normal text-body leading-[130%] text-text-1000">
          Budget:
          <span className="font-bold"> NPR {budgetAmount}</span>
        </p>
      </div>
      <div className="relative h-1 w-full rounded-full bg-card-200 z-10">
        <div
          className={`h-1 rounded-full bg-secondary-400`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
