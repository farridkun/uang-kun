import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { useConfirm } from "@/hooks/use-confirm"
import { useOpenTransaction } from "../hooks/use-open-transaction"
import { TransactionForm } from "./transaction-form"
import { useGetTransaction } from "../api/use-get-transaction"
import { useEditTransaction } from "../api/use-edit-transaction"
import { useDeleteTransaction } from "../api/use-delete-transaction"
import { insertTransactionSchema } from "@/db/schema"
import { useGetCategories } from "@/features/categories/api/use-get-categories"
import { useCreateCategories } from "@/features/categories/api/use-create-categories"
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertTransactionSchema.omit({
  id: true,
})

type FormSchmea = z.input<typeof formSchema>

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction()

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'you want to delete this transaction?',
  )

  const transcationQuery = useGetTransaction(id)
  const editMutation = useEditTransaction(id)
  const deleteMutation = useDeleteTransaction(id)

  const categoryQuery = useGetCategories()
  const categoryMutation = useCreateCategories()
  const onCreateCategory = (name: string) => categoryMutation.mutate({
    name,
  })
  const categoryOptions = (categoryQuery.data || []).map((category) => ({
    label: category.name,
    value: category.id,
  }))

  const accountQuery = useGetAccounts()
  const accountMutation = useCreateAccount()
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name,
  })
  const accountOptions = (accountQuery.data || []).map((account) => ({
    label: account.name,
    value: account.id,
  }))

  const isPending = editMutation.isPending || deleteMutation.isPending || categoryMutation.isPending || accountMutation.isPending
  const isLoading = transcationQuery.isLoading || categoryQuery.isLoading || accountQuery.isLoading

  const onSubmit = (values: FormSchmea) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  const onDelete = async () => {
    const ok = await confirm()

    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose()
        }
      })
    }
  }

  const defaultValues = transcationQuery.data ? {
    accountId: transcationQuery.data.accountId,
    categoryId: transcationQuery.data.categoryId,
    amount: transcationQuery.data.amount,
    date: transcationQuery.data.date
      ? new Date(transcationQuery.data.date) : new Date(),
    payee: transcationQuery.data.payee,
    notes: transcationQuery.data.notes,
  } : {
    accountId: '',
    categoryId: '',
    amount: '',
    date: new Date(),
    payee: '',
    notes: '',
  }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Transaction
            </SheetTitle>
            <SheetDescription>
              Edit an existing transaction
            </SheetDescription>
            {isLoading ? (
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <Loader2
                  className="size-4 text-muted-foreground animate-spin"
                />
              </div>
            ) : (
              <TransactionForm
                key={id}
                id={id}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                onDelete={onDelete}
                disabled={isPending}
                categoryOptions={categoryOptions}
                onCreateCategory={onCreateCategory}
                accountOptions={accountOptions}
                onCreateAccount={onCreateAccount}
              />
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}