'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

const TransactionsPage = () => {
  const newTransaction = useNewTransaction();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionQuery = useGetTransactions();
  const transaction = transactionQuery.data || [];

  const isDisabled =
    transactionQuery.isLoading ||
    deleteTransactions.isPending;

  if (transactionQuery.isLoading) {
    return (
      <div
        className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24"
      >
        <Card className="border-none drop-shadow-sm">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full mt-4" />
            <Skeleton className="h-8 w-full mt-4" />
            <Skeleton className="h-8 w-full mt-4" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24"
    >
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="md:flex flex-col gap-y-2 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Manage Transactions
          </CardTitle>
          <Button
            size="sm"
            onClick={newTransaction.onOpen}
          >
            <Plus className="size-4 mr-2" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey="category"
            columns={columns}
            data={transaction}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default TransactionsPage;
