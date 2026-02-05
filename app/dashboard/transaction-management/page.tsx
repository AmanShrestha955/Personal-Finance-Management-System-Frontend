"use client";
import { BudgetAlertCard } from "@/component/BudgetAlertCard";
import FilterCard from "@/component/FilterCard";
import FilterIcon from "@/component/icons/filter";
import SearchIcon from "@/component/icons/search";
import TransactionDetailCard from "@/component/TransactionDetailCard";
import TransactionItem from "@/component/TransactionItem";
import { BackendErrorResponse, TransactionDetail } from "@/types/type";
import { Plus } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, getData } from "@/utils/request";
import { AxiosError } from "axios";
type TransactionData = {
  message: string;
  data: TransactionDetail[];
};
type BudgetDetail = {
  _id: string;
  userId: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  alertThreshold: number;
  month: Date;
  isActive: boolean;
};
type BudgetData = {
  message: string;
  data: BudgetDetail[];
};
const Page: NextPage = ({}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail | null>(null);
  const {
    data: transactionData,
    isLoading: isLoadingTransactionData,
    error: transactionDataError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getData<null, TransactionData>("/transactions/"),
    select: (response) => response.data,
  });
  const {
    data: budgetData,
    isLoading: isLoadingBudgetData,
    error: budgetDataError,
  } = useQuery({
    queryKey: ["budgets"],
    queryFn: () => getData<null, BudgetData>("/budgets/"),
    select: (response) => response.data,
  });

  const onClickTransactionItem = (transaction: TransactionDetail) => {
    console.log("clicked transaction item:", transaction);
    if (selectedTransaction?._id === transaction._id) {
      console.log("deselected transaction");
      setSelectedTransaction(null);
      return;
    }
    setSelectedTransaction(transaction);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteData(`/transactions/${id}`);
    },
    onSuccess: () => {
      console.log("Transaction deleted successfully");
      // Refetch the transactions to update the list

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setSelectedTransaction(null); // Clear selected transaction
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      console.log("Error deleting transaction: ", message);
      // Optionally show error message to user
    },
  });

  useEffect(() => {
    console.log(transactionData);
  }, [transactionData]);
  useEffect(() => {
    console.log(budgetData);
  }, [budgetData]);
  return (
    <div className="w-full overflow-y-auto py-2xl px-xl flex flex-col bg-background-100 ">
      <h1 className="font-sansation text-heading font-semibold mb-md">
        Transaction Management
      </h1>
      <div className="flex flex-row justify-between items-center mb-lg">
        <p className="font-nunitosans text-heading3 font-bold">Budget Alerts</p>
        <button
          onClick={() =>
            router.push("/dashboard/transaction-management/add-alert")
          }
          className="flex flex-row gap-sm rounded-sm items-center font-nunitosans cursor-pointer px-sm py-xxs bg-primary-500 text-white hover:bg-primary-600 hover:shadow-effect-2 active:bg-primary-700 transition-all duration-500"
        >
          <Plus size={16} />
          <p>Alerts</p>
        </button>
      </div>
      {/* budget alert cards */}
      <div className="w-full flex flex-row overflow-hidden overflow-x-auto scrollbar [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full  [&::-webkit-scrollbar-thumb]:bg-primary-300 [&::-webkit-scrollbar-track]:bg-background-100/0 gap-md p-sm">
        {budgetData?.map((budget, index) => (
          <BudgetAlertCard
            key={index}
            id={budget._id}
            budgetAmount={budget.budgetAmount}
            spentAmount={budget.spentAmount}
            category={budget.category}
            alertThreshold={budget.alertThreshold}
          />
        ))}
      </div>
      {/* transactions table and transaction detail card */}
      <div className="w-full flex flex-row gap-md pt-sm">
        {/* transaction table */}
        <div className=" flex flex-1 flex-col gap-lg py-md px-sm bg-card-100 rounded-md shadow-effect-2">
          <div className="flex felx-row gap-4xl ">
            <h2 className="text-text-1000 font-bold font-nunitosans text-heading3 leading-[130%]">
              Recent Transactions
            </h2>
            <div className="flex flex-1 flex-row gap-sm items-start">
              <div className="flex flex-row gap-sm px-xs py-xxs border rounded-sm border-card-200 bg-card-100 shadow-effect-1 flex-1">
                <SearchIcon className="text-text-500" />
                <input
                  type="search"
                  name="search"
                  placeholder="Search transactions"
                  className="flex-1 focus:outline-none text-text-1000 "
                />
              </div>
              {/* filter button */}
              <div className="relative">
                <button
                  className={`flex flex-row rounded-sm border border-card-300 items-center justify-between min-w-[100px] text-text-1000 px-sm py-xxs shadow-effect-2 cursor-pointer hover:bg-card-200 ${
                    isFilterOpen ? "bg-card-200" : ""
                  } transition-all duration-300`}
                  onClick={() => {
                    setIsFilterOpen(!isFilterOpen);
                  }}
                >
                  Filter <FilterIcon />
                </button>
                {isFilterOpen && <FilterCard />}
              </div>
              {/* add Transaction button */}
              <button
                className="flex flex-row rounded-sm bg-primary-500 items-center gap-sm text-text-100 px-sm py-xxs shadow-effect-2 cursor-pointer hover:bg-primary-600 transition-all duration-300"
                onClick={() =>
                  router.push(
                    "/dashboard/transaction-management/add-transaction",
                  )
                }
              >
                <Plus size={18} className="text-text-100" /> Transaction
              </button>
            </div>
          </div>
          {/* transaction Table */}
          <div className="flex flex-col px-md">
            <table className="border-separate border-spacing-y-sm">
              <thead>
                <tr className="border-b border-card-600">
                  <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                    Name
                  </td>
                  <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                    Date
                  </td>
                  <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                    Type
                  </td>
                  <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                    Amount (Rs)
                  </td>
                  <td className="font-nunitosans font-bold text-body text-text-1000 leading-[130%] py-xs">
                    Actions
                  </td>
                </tr>
              </thead>
              <tbody className="[&>tr>td:first-child]:rounded-l-sm [&>tr>td:last-child]:rounded-r-sm">
                {transactionData?.map((transaction, index) => (
                  <TransactionItem
                    key={index}
                    {...transaction}
                    onClick={() => onClickTransactionItem(transaction)}
                    onDelete={() => deleteMutation.mutate(transaction._id)}
                    isSelected={
                      selectedTransaction
                        ? selectedTransaction._id === transaction._id
                        : false
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* transaction detail card */}
        {selectedTransaction && (
          <TransactionDetailCard {...selectedTransaction} />
        )}
      </div>
    </div>
  );
};
export default Page;
