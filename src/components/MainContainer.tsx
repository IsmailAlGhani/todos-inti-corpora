import { API_URL, useTodosList } from "@/api/query";
import { JSX, useCallback, useMemo, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { flexRender } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTableTodos, columnsTodo } from "./TableTodos";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { DataUpdateProps, typeModalAction } from "@/lib/utils";
import TodoActionModal from "./TodoActionModal";
import ChartCompletedTodo from "./ChartCompletedTodo";

const formSchema = z.object({
  todoName: z
    .string()
    .min(2, {
      message: "Todo Name must be at least 2 characters.",
    })
    .max(50, {
      message: "Todo Name max 50 characters.",
    }),
});

type BodyForm = {
  todoName: string;
};

function MainContainer(): JSX.Element {
  const [dataUpdate, setDataUpdate] = useState<DataUpdateProps>({
    id: "",
    type: typeModalAction.UPDATE,
  });
  const {
    data: todosList,
    isLoading: loadingTodosList,
    refetch: refetchTodosList,
  } = useTodosList();

  const handleUpdate = useCallback(
    ({ id, type }: DataUpdateProps) => setDataUpdate({ id, type }),
    []
  );

  const { table } = DataTableTodos({ data: todosList ?? [], handleUpdate });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todoName: "",
    },
  });

  const createTodo = useMutation({
    mutationFn: ({ body }: { body: BodyForm }) => {
      return axios.post(API_URL, {
        ...body,
        isComplete: false,
      });
    },
    onSuccess: () => {
      toast({
        className:
          "top-0 right-0 flex fixed bg-green-500 md:max-w-[420px] md:top-4 md:right-4",
        variant: "default",
        title: "Success Create Todo",
        description: "Successfull create todo item.",
      });
      refetchTodosList();
      form.reset();
    },
    onError: () => {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const updateTodo = useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return axios.put(`${API_URL}/${id}`, {
        isComplete: true,
      });
    },
    onSuccess: () => {
      toast({
        className:
          "top-0 right-0 flex fixed bg-green-500 md:max-w-[420px] md:top-4 md:right-4",
        variant: "default",
        title: "Success Update Todo",
        description: "Successfull update todo, completed todo item.",
      });
      refetchTodosList();
    },
    onError: () => {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: ({ id }: { id: string }) => {
      return axios.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      toast({
        className:
          "top-0 right-0 flex fixed bg-green-500 md:max-w-[420px] md:top-4 md:right-4",
        variant: "default",
        title: "Success Delete Todo",
        description: "Successfull delete todo item.",
      });
      refetchTodosList();
    },
    onError: () => {
      toast({
        className:
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    },
  });

  const isLoading = useMemo(
    () =>
      loadingTodosList ||
      createTodo.status === "pending" ||
      updateTodo.status === "pending",
    [loadingTodosList, createTodo, updateTodo]
  );

  const submitForm = async (values: z.infer<typeof formSchema>) => {
    createTodo.mutate({ body: values });
  };

  const handleModalAction = useCallback(() => {
    if (dataUpdate.type === typeModalAction.UPDATE) {
      updateTodo.mutate({ id: dataUpdate.id });
    } else {
      deleteTodo.mutate({ id: dataUpdate.id });
    }
    setDataUpdate((prevState) => ({
      ...prevState,
      id: "",
    }));
  }, [dataUpdate, updateTodo, deleteTodo]);

  return (
    <div className="flex flex-col items-center w-full overflow-y-scroll scrollbar-hide bg-gray-500 bg-opacity-10 backdrop-blur-sm backdrop-filter dark:bg-gray-800 dark:bg-opacity-20">
      {isLoading ? <LoadingSpinner /> : null}
      <div className="flex flex-col gap-4 pb-4 h-[90vh] w-full items-center overflow-y-scroll scrollbar-hide">
        <div className="flex flex-col-reverse items-center sm:flex-row sm:justify-between gap-2 w-full py-4">
          <Input
            placeholder="Filter title..."
            value={
              (table.getColumn("todoName")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("todoName")?.setFilterValue(event.target.value)
            }
            className="w-full sm:max-w-sm"
          />
          <div className="flex w-full flex-col items-end sm:justify-end sm:flex-row gap-2 sm:gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="bg-slate-500">
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create Todo</DialogTitle>
                  <DialogDescription>
                    Create what you want todo.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    className="flex flex-col w-full gap-4"
                    onSubmit={form.handleSubmit(submitForm)}
                  >
                    <FormField
                      control={form.control}
                      name="todoName"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2 w-full">
                          <div className="grid grid-cols-4 items-center">
                            <FormLabel>Todo Name</FormLabel>
                            <FormControl className="col-span-3">
                              <Input placeholder="Todo Name..." {...field} />
                            </FormControl>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button type="submit">Create</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const handleName = (id: string) => {
                      switch (id) {
                        case "isComplete":
                          return "Status";
                        case "createdAt":
                          return "Created Date";
                        case "updatedAt":
                          return "Created Date";
                        default:
                          return "Title";
                      }
                    };
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {handleName(column.id)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md w-full border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="!text-white" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="!text-white">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnsTodo(handleUpdate).length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end w-full space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount().toLocaleString()} page(s) showing.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
        <ChartCompletedTodo dataTodo={todosList ?? []} />
      </div>
      <TodoActionModal
        openDialog={!!dataUpdate.id}
        type={dataUpdate.type}
        handleAction={handleModalAction}
      />
    </div>
  );
}

export default MainContainer;
