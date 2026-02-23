import {
  RecurringTransaction,
  toggleRecurringTransaction,
} from "@/utils/recurringTransctionApi";
import AutomatedTransactionsItemCard from "./AutomatedTransactionsItemCard";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AutomatedTransactionsCard = ({
  data,
}: {
  data: RecurringTransaction[];
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toggleMutation = useMutation({
    mutationFn: (id: string) => toggleRecurringTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring-transactions"] });
      console.log("Transaction toggled successfully");
    },
    onError: (error) => {
      console.error("Failed to toggle transaction:", error);
    },
  });
  return (
    <div className="flex flex-col px-lg py-md gap-md bg-card-100 rounded-md border border-card-200 shadow-effect-2 min-w-100 max-w-[420px]">
      <div className="flex flex-col gap-xxs">
        <h2 className="font-nunitosans font-bold text-heading3 leading-[130%] text-text-1000">
          Automated Transactions
        </h2>
        <p className="font-nunitosans font-medium text-body text-text-600 leading-[130%]">
          Manage your recurring income and expenses
        </p>
      </div>
      <button
        onClick={() => {
          router.push("/dashboard/transaction-management/add-auto-transaction");
        }}
        className="bg-primary-500 text-white px-md py-sm rounded-md hover:bg-primary-600 transition-colors cursor-pointer "
      >
        Add Auto Transaction
      </button>
      {data.length !== 0 &&
        data.map((transaction, index) => (
          <AutomatedTransactionsItemCard
            key={index}
            onClick={() => {
              router.push(
                `/dashboard/transaction-management/add-auto-transaction?id=${transaction._id}`,
              );
            }}
            title={transaction.title}
            category={transaction.category}
            amount={transaction.amount}
            type={transaction.type}
            frequency={transaction.frequency}
            isActive={transaction.isActive}
            onToggle={() => toggleMutation.mutate(transaction._id)}
          />
        ))}
    </div>
  );
};
export default AutomatedTransactionsCard;
