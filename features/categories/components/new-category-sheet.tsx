import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNewCategory } from "../hooks/use-new-category"
import { CategoryForm } from "./category-form"
import { insertCategorySchema } from "@/db/schema"
import { z } from "zod"
import { useCreateCategories } from "../api/use-create-categories"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
  name: true,
})

type FormSchmea = z.input<typeof formSchema>

export const NewCategorySheet = () => {
  const { isOpen, onClose } = useNewCategory()

  const mutation = useCreateCategories()

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
            New Category
          </SheetTitle>
          <SheetDescription>
            Create a new category to track your spending.
          </SheetDescription>
          <CategoryForm
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
