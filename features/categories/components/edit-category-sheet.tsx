import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CategoryForm } from "./category-form"
import { insertCategorySchema } from "@/db/schema"
import { z } from "zod"
import { useOpenCategory } from "../hooks/use-open-category"
import { Loader2 } from "lucide-react"
import { useEditCategory } from "../api/use-edit-category"
import { useGetCategory } from "../api/use-get-category"
import { useDeleteCategory } from "../api/use-delete-category"
import { useConfirm } from "@/hooks/use-confirm"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = insertCategorySchema.pick({
  name: true,
})

type FormSchmea = z.input<typeof formSchema>

export const EditCategorySheet = () => {
  const { isOpen, onClose, id } = useOpenCategory()

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'you want to delete this category?',
  )

  const categoriesQuery = useGetCategory(id)
  const editMutation = useEditCategory(id)
  const deleteMutation = useDeleteCategory(id)

  const isPending = editMutation.isPending || deleteMutation.isPending
  const isLoading = categoriesQuery.isLoading

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

  const defaultValues = categoriesQuery.data ? {
    name: categoriesQuery.data.name,
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
              Edit Category
            </SheetTitle>
            <SheetDescription>
              Edit an existing category
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
              <CategoryForm
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