import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AccountForm } from "./account-form"
import { insertAccountSchema } from "@/db/schema"
import { z } from "zod"
import { useOpenAccount } from "../hooks/use-open-account"
import { Loader2 } from "lucide-react"
import { useEditAccount } from "../api/use-edit-account"
import { useGetAccount } from "../api/use-get-account"
import { useDeleteAccount } from "../api/use-delete-account"
import { useConfirm } from "@/hooks/use-confirm"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertAccountSchema.pick({
  name: true,
})

type FormSchmea = z.input<typeof formSchema>

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount()

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'you want to delete this account?',
  )

  const accountQuery = useGetAccount(id)
  const editMutation = useEditAccount(id)
  const deleteMutation = useDeleteAccount(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = accountQuery.isLoading

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

  const defaultValues = accountQuery.data ? {
    name: accountQuery.data.name,
  } : {
    name: '',
  }

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Account
            </SheetTitle>
            <SheetDescription>
              Edit an existing account
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
              <AccountForm
                id={id}
                onSubmit={onSubmit}
                disabled={isPending}
                defaultValues={defaultValues}
                onDelete={onDelete}
              />
            )}
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </>
  )
}