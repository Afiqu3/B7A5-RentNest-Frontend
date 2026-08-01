"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  CheckCircle2,
  PencilLine,
  PlusCircle,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  deleteCategory,
  submitCategoryAction,
  type CategoryActionState,
} from "../../_actions/categoryActions";

type CategoryItem = {
  id: string;
  name: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type CategoriesProps = {
  categories: CategoryItem[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

const initialFormState: CategoryActionState = {
  success: false,
  message: "",
  category: null,
  mode: null,
};

const Categories = ({ categories: initialCategories }: CategoriesProps) => {
  const router = useRouter();
  const [categories, setCategories] = React.useState(initialCategories);
  const [name, setName] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(
    null,
  );
  const submitCategoryForm = React.useCallback(
    async (prevState: CategoryActionState, formData: FormData) => {
      return submitCategoryAction(prevState, formData);
    },
    [],
  );
  const [state, formAction, pending] = React.useActionState(
    submitCategoryForm,
    initialFormState,
  );
  const [, startTransition] = React.useTransition();

  React.useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state.message, state.success]);

  React.useEffect(() => {
    if (!state.success || !state.message) return;

    const timeoutId = window.setTimeout(() => {
      if (state.mode === "create" && state.category) {
        setCategories((current) => [
          state.category as CategoryItem,
          ...current,
        ]);
      }

      if (state.mode === "update" && state.category) {
        setCategories((current) =>
          current.map((item) =>
            item.id === state.category?.id
              ? (state.category as CategoryItem)
              : item,
          ),
        );
      }

      setName("");
      setEditingId(null);
      router.refresh();
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [router, state.category, state.message, state.mode, state.success]);

  const handleEdit = (category: CategoryItem) => {
    setEditingId(category.id);
    setName(category.name);
  };

  const handleDelete = (category: CategoryItem) => {
    setPendingDeleteId(category.id);
  };

  const confirmDelete = () => {
    if (!pendingDeleteId) return;

    startTransition(async () => {
      try {
        const result = await deleteCategory(pendingDeleteId);
        if (result?.success) {
          setCategories((current) =>
            current.filter((item) => item.id !== pendingDeleteId),
          );
          toast.success("Category deleted successfully.");
          router.refresh();
        } else {
          toast.error(result?.message || "Could not delete this category.");
        }
      } catch {
        toast.error("Unable to delete this category right now.");
      } finally {
        setPendingDeleteId(null);
      }
    });
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-border/70 bg-linear-to-br from-primary/10 via-background to-background p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Tag className="size-4" />
              Category manager
            </div>
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Organize your property categories
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Add, edit, and remove categories to keep your listings
                structured and easy to browse.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              {categories.length} categories
            </div>
            <p className="mt-1">Ready for the next update</p>
          </div>
        </div>

        <form
          action={formAction}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <input type="hidden" name="editingId" value={editingId ?? ""} />
          <div className="flex-1">
            <Input
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter category name"
              className="h-11"
            />
          </div>
          <div className="flex gap-2 sm:w-auto">
            <Button type="submit" disabled={pending} className="gap-2">
              <PlusCircle className="size-4" />
              {editingId ? "Save changes" : "Add category"}
            </Button>
            {editingId ? (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Tag className="size-6" />
          </div>
          <h2 className="mt-5 font-heading text-xl font-semibold text-foreground">
            No categories yet
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Create a new category to start organizing your property listing
            catalog.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <CheckCircle2 className="size-4 text-primary" />
                    Active category
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {category.name}
                  </h3>
                </div>
                <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                  <Tag className="size-4" />
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>Created: {formatDate(category.createdAt)}</p>
                <p>Updated: {formatDate(category.updatedAt)}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => handleEdit(category)}
                >
                  <PencilLine className="size-3.5" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(category)}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete category?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The category will be
                        removed from the list immediately.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={confirmDelete}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Categories;
