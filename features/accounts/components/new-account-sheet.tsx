import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewAccount } from "../hooks/use-new-account"
import { AccountForm } from "./account-form"
import { insertAccountSchema } from "@/db/schema"
import { z } from "zod"
import { useCreateAccount } from "../api/use-create-accounts"

const formSchema = insertAccountSchema.pick({
  name: true,
})

type FormSchmea = z.input<typeof formSchema>

export const NewAccountSheet = () => {
  const { isOpen, onClose } = useNewAccount()

  const mutation = useCreateAccount()

  const onSubmit = (values: FormSchmea) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose()
      }
    })
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            New Account
          </SheetTitle>
          <SheetDescription>
            Create a new account to track your spending.
          </SheetDescription>
          <AccountForm
            onSubmit={onSubmit}
            disabled={mutation.isPending}
            defaultValues={{
              name: '',
            }}
          />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}