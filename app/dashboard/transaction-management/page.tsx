"use client";
import { BudgetAlertCard } from "@/component/BudgetAlertCard";
import FilterCard, { FilterState } from "@/component/FilterCard";
import FilterIcon from "@/component/icons/filter";
import SearchIcon from "@/component/icons/search";
import TransactionDetailCard from "@/component/TransactionDetailCard";
import TransactionItem from "@/component/TransactionItem";
import { BackendErrorResponse, TransactionDetail } from "@/types/type";
import { Plus } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteData, getData } from "@/utils/request";
import { AxiosError } from "axios";
import { getBudgets } from "@/utils/statisticsApi";
import AutomatedTransactionsCard from "@/component/AutomatedTransactionsCard";
import { getRecurringTransactions } from "@/utils/recurringTransctionApi";
import { useNotification } from "@/hooks/NotificationContext";

type TransactionData = {
  message: string;
  data: TransactionDetail[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
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
type DeleteTransactionResponse = {
  message: string;
};

const Page: NextPage = ({}) => {
  const { addNotification } = useNotification();
  const queryClient = useQueryClient();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionDetail | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput);
      setCurrentPage(1);
    }
  };

  const defaultFilters: FilterState = {
    type: "all",
    startDate: "",
    endDate: "",
    categories: [],
  };
  const [activeFilters, setActiveFilters] =
    useState<FilterState>(defaultFilters);

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    setIsFilterOpen(false);
    setCurrentPage(1);
  };

  const handleCancelFilter = () => {
    setIsFilterOpen(false);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const { data: transactionData, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ["transactions", activeFilters, searchQuery, currentPage],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set("type", activeFilters.type);
      if (activeFilters.startDate)
        params.set("startDate", activeFilters.startDate);
      if (activeFilters.endDate) params.set("endDate", activeFilters.endDate);
      if (activeFilters.categories.length > 0) {
        params.set("category", activeFilters.categories.join(","));
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }
      params.set("page", currentPage.toString());
      params.set("limit", itemsPerPage.toString());
      return getData<null, TransactionData>(
        `/transactions?${params.toString()}`,
      );
    },
  });

  const { data: budgetData, isLoading: isLoadingBudgets } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => {
      const response = await getBudgets();
      return response;
    },
  });

  const { data: recurringTransactionData, isLoading: isLoadingRecurring } =
    useQuery({
      queryKey: ["recurringTransactions"],
      queryFn: async () => {
        const response = await getRecurringTransactions();
        return response.data;
      },
    });

  const onClickTransactionItem = (transaction: TransactionDetail) => {
    if (selectedTransaction?._id === transaction._id) {
      setSelectedTransaction(null);
      setShowDetailPanel(false);
      return;
    }
    setSelectedTransaction(transaction);
    setShowDetailPanel(true);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteData<DeleteTransactionResponse>(`/transactions/${id}`);
    },
    onSuccess: (data: DeleteTransactionResponse) => {
      addNotification("success", "Transaction Deleted", data.message);
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setSelectedTransaction(null);
      setShowDetailPanel(false);
    },
    onError: (error: AxiosError<BackendErrorResponse>) => {
      const message = error?.response?.data?.error || error.message;
      console.log("Error deleting transaction: ", message);
    },
  });

  return (
    <div className="w-full py-2xl px-md md:px-xl flex flex-col bg-background-100">
      <h1 className="font-sansation text-heading font-semibold mb-md">
        Transaction Management
      </h1>

      {/* Budget Alerts header */}
      <div className="flex flex-row justify-between items-center mb-lg">
        <p className="font-nunitosans text-heading3 font-bold">Budget Alerts</p>
        <button
          onClick={() =>
            router.push("/dashboard/transaction-management/add-alert")
          }
          className="flex flex-row gap-sm rounded-sm items-center font-nunitosans cursor-pointer px-sm py-xs bg-primary-500 text-white hover:bg-primary-600 hover:shadow-effect-2 active:bg-primary-700 transition-all duration-500"
        >
          <Plus size={16} />
          <p>Alerts</p>
        </button>
      </div>

      {/* Budget alert cards — horizontal scroll */}
      <div
        ref={scrollRef}
        className="w-full flex flex-row overflow-x-auto scrollbar [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary-300 [&::-webkit-scrollbar-track]:bg-background-100/0 gap-md p-sm"
      >
        {isLoadingBudgets ? (
          <div className="flex flex-row gap-md">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[120px] w-[314px] rounded-md bg-card-200 animate-pulse shrink-0"
              />
            ))}
          </div>
        ) : !budgetData || budgetData.length === 0 ? (
          <div className="flex flex-row items-center gap-sm py-sm">
            <p className="font-nunitosans text-body text-text-600">
              No budget alerts set.
            </p>
            <button
              onClick={() =>
                router.push("/dashboard/transaction-management/add-alert")
              }
              className="font-nunitosans text-body text-primary-500 font-bold hover:underline cursor-pointer"
            >
              Create one
            </button>
          </div>
        ) : (
          budgetData.map((budget, index) => (
            <BudgetAlertCard
              key={index}
              id={budget._id}
              budgetAmount={budget.budgetAmount}
              spentAmount={budget.spentAmount}
              category={budget.category}
              alertThreshold={budget.alertThreshold}
            />
          ))
        )}
      </div>

      {/* Main content */}
      <div className="w-full flex flex-col xl:flex-row gap-md pt-sm xl:items-start">
        {/* Transaction table */}
        <div className="flex flex-1 flex-col gap-lg py-md px-sm bg-card-100 rounded-md shadow-effect-2 min-w-0 ">
          {/* Table header — wraps on mobile */}
          <div className="flex flex-col lg:flex-row gap-sm lg:items-center justify-between">
            <h2 className="text-text-1000 font-bold font-nunitosans text-heading3 leading-[130%] shrink-0">
              Recent Transactions
            </h2>
            <div className="flex flex-row gap-sm items-center flex-wrap">
              <div className="flex flex-row gap-sm px-xs py-xxs border rounded-sm border-card-200 bg-card-100 shadow-effect-1 flex-1 min-w-[140px]">
                <button
                  onClick={handleSearch}
                  className="text-text-500 hover:text-text-1000 transition-colors cursor-pointer shrink-0"
                >
                  <SearchIcon />
                </button>
                <input
                  type="search"
                  name="search"
                  placeholder="Search transactions"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="flex-1 focus:outline-none text-text-1000 min-w-0"
                />
              </div>
              <div className="relative">
                <button
                  className={`flex flex-row rounded-sm border border-card-300 items-center justify-between min-w-[90px] text-text-1000 px-sm py-xs shadow-effect-2 cursor-pointer hover:bg-card-200 ${
                    isFilterOpen ? "bg-card-200" : ""
                  } transition-all duration-300`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  Filter <FilterIcon />
                </button>
                {isFilterOpen && (
                  <FilterCard
                    initialFilters={activeFilters}
                    onApply={handleApplyFilters}
                    onCancel={handleCancelFilter}
                  />
                )}
              </div>
              <button
                className="flex flex-row rounded-sm bg-primary-500 items-center gap-sm text-text-100 px-sm py-xs shadow-effect-2 cursor-pointer hover:bg-primary-600 transition-all duration-300 whitespace-nowrap"
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

          {/* Table — horizontal scroll on mobile */}
          <div className="overflow-x-auto px-md">
            <table className="border-separate border-spacing-y-sm w-full min-w-[500px]">
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
                {isLoadingTransactions ? (
                  <tr>
                    <td colSpan={5} className="py-xl text-center">
                      <div className="flex flex-col items-center gap-sm">
                        <div className="w-6 h-6 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                        <p className="font-nunitosans text-body text-text-600">
                          Loading transactions...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : !transactionData?.data ||
                  transactionData.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-xl text-center">
                      <p className="font-nunitosans text-body text-text-600">
                        No transactions found
                      </p>
                    </td>
                  </tr>
                ) : (
                  transactionData?.data?.map((transaction, index) => (
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {transactionData?.pagination &&
            transactionData.pagination.totalPages > 1 && (
              <div className="flex flex-row justify-between items-center px-md py-md border-t border-card-200 flex-wrap gap-sm">
                <p className="text-body text-text-700 font-nunitosans">
                  Page {transactionData.pagination.currentPage} of{" "}
                  {transactionData.pagination.totalPages} (
                  {transactionData.pagination.totalItems} total)
                </p>
                <div className="flex flex-row gap-sm">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-sm py-xxs rounded-sm border border-card-300 bg-card-100 text-text-1000 hover:bg-card-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Previous
                  </button>
                  <div className="flex flex-row gap-xs items-center">
                    {Array.from(
                      { length: transactionData.pagination.totalPages },
                      (_, i) => i + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-xs py-xxs rounded-sm border transition-all duration-300 ${
                          currentPage === page
                            ? "bg-primary-500 text-white border-primary-500"
                            : "border-card-300 bg-card-100 text-text-1000 hover:bg-card-200"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      if (transactionData.pagination !== undefined) {
                        setCurrentPage(
                          Math.min(
                            transactionData.pagination.totalPages,
                            currentPage + 1,
                          ),
                        );
                      }
                    }}
                    disabled={
                      currentPage === transactionData.pagination.totalPages
                    }
                    className="px-sm py-xxs rounded-sm border border-card-300 bg-card-100 text-text-1000 hover:bg-card-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
        </div>

        {/* Detail panel — full screen overlay on mobile, sticky sidebar on xl */}
        {showDetailPanel && selectedTransaction ? (
          <>
            {/* Mobile/tablet full screen overlay */}
            <div className="xl:hidden fixed inset-0 z-50 bg-background-100 overflow-y-auto">
              <div className="flex flex-col h-full">
                {/* Top bar with close button */}
                <div className="flex flex-row justify-between items-center px-md py-sm border-b border-card-200 bg-card-100 sticky top-0 z-10">
                  <p className="font-nunitosans font-bold text-heading3 text-text-1000">
                    Transaction Detail
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTransaction(null);
                      setShowDetailPanel(false);
                    }}
                    className="px-sm py-xxs rounded-sm border border-card-200 bg-card-100 hover:bg-card-200 active:bg-card-300 transition-all duration-300 text-text-1000 font-nunitosans font-medium text-body cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                {/* Detail content */}
                <div className="flex-1 p-md">
                  <TransactionDetailCard {...selectedTransaction} />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {/* Desktop: sticky right panel */}
        <div className="hidden xl:flex flex-col">
          <div className="sticky top-4">
            {selectedTransaction ? (
              <TransactionDetailCard {...selectedTransaction} />
            ) : isLoadingRecurring ? (
              <div className="flex flex-col items-center gap-sm py-xl px-md">
                <div className="w-6 h-6 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                <p className="font-nunitosans text-body text-text-600">
                  Loading...
                </p>
              </div>
            ) : (
              <AutomatedTransactionsCard
                data={recurringTransactionData || []}
              />
            )}
          </div>
        </div>

        {/* Mobile/tablet: show AutomatedTransactionsCard below table when nothing selected */}
        {!selectedTransaction && (
          <div className="xl:hidden">
            {isLoadingRecurring ? (
              <div className="flex flex-col items-center gap-sm py-xl">
                <div className="w-6 h-6 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                <p className="font-nunitosans text-body text-text-600">
                  Loading automated transactions...
                </p>
              </div>
            ) : (
              <AutomatedTransactionsCard
                data={recurringTransactionData || []}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
