"use client";

// THIS COMPONENT IS FORKED FROM https://ui.shadcn.com/docs/components/data-table
// AND MODIFIED

import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  SquareArrowOutUpRightIcon,
  Trash2Icon,
  FilePlus2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/hooks/use-toast";

import { formatDistance } from "date-fns";

import { DataTablePagination } from "./pagination";

// definitions
import { type ProjectModel } from "@/lib/definitions/Project";

// server actions
import { createProject, deleteProject } from "@/lib/actions/projects";
import { useRouter } from "next/navigation";

function timeAgo(dateString: string) {
  return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
}

export default function ProjectsTable({
  data,
  username,
}: {
  data: ProjectModel[];
  username: string;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleCreateProject = () => {
    setLoading(true);
    createProject()
      .then((project) => {
        if (project) {
          router.push(`/${username}/room/${project.id}`);
        }
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Oops, something went wrong",
          description:
            "Unexpected error occurred while creating project, please try again.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteProject = (rowIndex: number) => {
    setLoading(true);
    const projectId = data[rowIndex].id;
    deleteProject(projectId)
      .then(() => {
        toast({
          title: "Project deleted",
          description: "Project was successfully deleted.",
        });
        router.refresh();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Oops, something went wrong",
          description:
            "Unexpected error occurred while deleting project, please try again.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenProject = (rowIndex: number) => {
    const projectId = data[rowIndex].id;
    router.push(`/${username}/room/${projectId}`);
  };

  const columns: ColumnDef<ProjectModel>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Updated
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{timeAgo(row.getValue("updatedAt"))}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{timeAgo(row.getValue("createdAt"))}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end items-center">
            <Button
              disabled={loading}
              size="sm"
              className="rounded-full"
              onClick={() => handleOpenProject(row.index)}
            >
              Open
              {loading ? <Loading /> : <SquareArrowOutUpRightIcon />}
            </Button>

            <Button
              variant="link"
              disabled={loading}
              className="rounded-full text-destructive"
              onClick={() => handleDeleteProject(row.index)}
            >
              <Trash2Icon size={24} />
              {loading && <Loading />}
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        {/* SEARCH */}
        <Input
          placeholder="Filter projects..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm p-4"
        />

        {/* CREATE NEW PROJECT BUTTON */}
        <Button
          disabled={loading}
          className="ml-auto"
          onClick={handleCreateProject}
        >
          Create New Project
          {loading ? <Loading /> : <FilePlus2Icon />}
        </Button>
      </div>

      {/* PROJECT TABLE */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="p-4">
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className=""
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-8 py-4">
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No debate rooms.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        {/* ADVANCED PAGINATION */}
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
