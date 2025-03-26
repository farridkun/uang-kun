'use client'

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { DataCard, DataCardLoading } from "./data-card";
import { Suspense, useState } from "react";

export const DataGrid = () => {
  const { data, isLoading } = useGetSummary();

  const [isHideAmount, setIsHideAmount] = useState({
    remaining: false,
    income: false,
    expenses: false,
  });

  const params = useSearchParams();
  const from = params.get('from') || undefined;
  const to = params.get('to') || undefined;

  const dateRangeLabel = formatDateRange({ from, to })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
      </div>      
    )
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
        <DataCard
          title='Remaining'
          value={data?.remainingAmount}
          percentageChange={data?.remainingChange}
          icon={FaPiggyBank}
          dateRange={dateRangeLabel}
          isHideAmount={isHideAmount.remaining}
          onChangeHideAmount={() => setIsHideAmount(prev => ({ ...prev, remaining: !prev.remaining }))}
        />
        <DataCard
          title='Income'
          value={data?.incomeAmount}
          percentageChange={data?.incomeChange}
          icon={FaArrowTrendUp}
          dateRange={dateRangeLabel}
          isHideAmount={isHideAmount.income}
          onChangeHideAmount={() => setIsHideAmount(prev => ({ ...prev, income: !prev.income }))}
        />
        <DataCard
          title='Expenses'
          value={data?.expensesAmount}
          percentageChange={data?.expensesChange}
          icon={FaArrowTrendDown}
          dateRange={dateRangeLabel}
          isHideAmount={isHideAmount.expenses}
          onChangeHideAmount={() => setIsHideAmount(prev => ({ ...prev, expenses: !prev.expenses }))}
        />
      </div>
    </Suspense>
  )
}