import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import React from "react";
import { Todos } from "@/api/query";
import { Badge } from "./ui/badge";
import { DateTime } from "luxon";
import { DataUpdateProps, typeModalAction } from "@/lib/utils";

export const columnsTodo: (
  handleUpdate: ({ id, type }: DataUpdateProps) => void
) => ColumnDef<Todos>[] = (handleUpdate) => {
  return [
    {
      accessorKey: "todoName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="!bg-transparent hover:!g-transparent px-0"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-semibold">{row.getValue("todoName")}</div>
      ),
    },
    {
      accessorKey: "isComplete",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        <div className="capitalize flex w-full justify-center">
          <Badge
            className={
              row.getValue("isComplete") ? "bg-green-400" : "bg-blue-400"
            }
          >
            {row.getValue("isComplete") ? "Finish" : "Unfinish"}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Created Date</div>,
      cell: ({ row }) => {
        const value: string = row.getValue("createdAt");
        const deadline = value
          ? DateTime.fromISO(value).toFormat("dd MMMM yyyy")
          : "";
        return <div className="font-medium text-center">{deadline}</div>;
      },
    },
    {
      accessorKey: "updateAt",
      header: () => <div className="text-center">Updated Date</div>,
      cell: ({ row }) => {
        const value: string = row.getValue("updateAt");
        const deadline = value
          ? DateTime.fromISO(value).toFormat("dddd, dd MMMM YYYY")
          : "";
        return <div className="font-medium text-center">{deadline}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const todo = row.original;

        return (
          <div className="flex justify-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger data-testid={`actions-${todo._id}`} asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {!todo.isComplete ? (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      data-testid={`action-update-${todo._id}`}
                      onClick={() =>
                        handleUpdate({
                          id: todo._id,
                          type: typeModalAction.UPDATE,
                        })
                      }
                    >
                      Update Todo Status
                    </DropdownMenuItem>
                  </>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  data-testid={`action-delete-${todo._id}`}
                  onClick={() =>
                    handleUpdate({ id: todo._id, type: typeModalAction.DELETE })
                  }
                >
                  Delete Todo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

export function DataTableTodos({
  data,
  handleUpdate,
}: {
  data: Todos[];
  handleUpdate: ({ id, type }: DataUpdateProps) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, //initial page index
    pageSize: 5, //default page size
  });
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns: columnsTodo(handleUpdate),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  return { table };
}
