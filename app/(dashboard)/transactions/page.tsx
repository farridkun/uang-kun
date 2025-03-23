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
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { transactions as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

enum VARIANTS {
  LIST = 'LIST',
  IMPORT = 'IMPORT',
}

const INITIAL_IMPORT_RESULT = {
  data: [],
  errors: [],
  meta: {},
}

const TransactionsPage = () => {
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST)
  const [importResult, setImportResult] = useState<typeof INITIAL_IMPORT_RESULT>(INITIAL_IMPORT_RESULT)

  const onUpload = (result: typeof INITIAL_IMPORT_RESULT) => {
    setImportResult(result)
    setVariant(VARIANTS.IMPORT)
  }

  const onCancelImport = () => {
    setImportResult(INITIAL_IMPORT_RESULT)
    setVariant(VARIANTS.LIST)
  }

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactionQuery = useGetTransactions();
  const transaction = transactionQuery.data || [];

  const isDisabled =
    transactionQuery.isLoading ||
    deleteTransactions.isPending;

  const onSubmitImport = async (
    values: typeof transactionSchema.$inferInsert[],
  ) => {
    const accountId = await confirm();

    if (!accountId) {
      return toast.error('Please select an account');
    }

    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    }));

    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    })
  }

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

  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog />
        <ImportCard
          data={importResult.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
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
          <div
            className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2"
          >
            <Button
              size="sm"
              onClick={newTransaction.onOpen}
              className="w-full lg:w-auto"
            >
              <Plus className="size-4 mr-2" />
              Add Transaction
            </Button>
            <UploadButton
              onUpload={onUpload}
            />
          </div>
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
