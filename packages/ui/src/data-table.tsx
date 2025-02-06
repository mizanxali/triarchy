'use client';

import { flexRender, type ColumnDef } from '@tanstack/react-table';

import type { Row, Table as TTableType } from '@tanstack/react-table';
import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { Button } from './button';
import { Input } from './input';
import { cn } from '.';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: TTableType<TData>;
  rightHeaderActions?: React.ReactNode;
  placeholder?: string;
  filterKey?: (keyof TData)[];
  onSearchChange: (value: string) => void;
  columnCount: number;
  pageCount: number;
  onPageClick: (pageIndex: number) => void;
  pageStartIndex: number;
  onRowClick?: (row: Row<TData>) => void;
  setPageStartIndex: React.Dispatch<React.SetStateAction<number>>;
  showSearchInput?: boolean;
  isLoading?: boolean;
  rowCount: number;
  pageSize: number;
}

export function DataTable<TData, TValue>({
  columns,
  isLoading,
  table,
  filterKey,
  placeholder,
  onSearchChange,
  rightHeaderActions,
  columnCount,
  onPageClick,
  pageCount,
  pageStartIndex,
  setPageStartIndex,
  onRowClick,
  showSearchInput,
  rowCount,
}: DataTableProps<TData, TValue>) {
  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <div className="w-full">
      <div className="flex md:items-center py-4 md:justify-between md:flex-row flex-col gap-4 items-start">
        {(showSearchInput ?? filterKey?.[0]) && (
          <Input
            icon={<Search size={18} color="#FFFFFF66" />}
            placeholder={placeholder ?? 'Search by filename, link'}
            variant="default"
            className="max-w-sm"
            onChange={(event) => {
              onSearchChange?.(event.target.value);
              if (filterKey?.[0])
                table
                  .getColumn(filterKey[0].toString())
                  ?.setFilterValue(event.target.value);
            }}
            value={
              filterKey?.[0]
                ? ((table
                    .getColumn(filterKey[0].toString() ?? '')
                    ?.getFilterValue() as string) ?? undefined)
                : undefined
            }
          />
        )}
        <div>{rightHeaderActions}</div>
      </div>
      {isLoading ? (
        <TableSkeleton columns={columns.length} />
      ) : (
        <>
          <div className="rounded-lg">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                <tr>
                  <td className="pt-2" />
                </tr>

                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      className={cn(
                        onRowClick ? 'cursor-pointer' : 'cursor-default',
                      )}
                      key={row.id}
                      onClick={() => onRowClick?.(row)}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columnCount}
                      className="h-12 text-center"
                    >
                      <span className="text-white/60 font-chakra text-sm font-medium">
                        No results found
                      </span>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <PaginationControls
            pageCount={pageCount}
            pageIndex={pageIndex}
            rowCount={rowCount}
            onPageClick={onPageClick}
            pageStartIndex={pageStartIndex}
            setPageStartIndex={setPageStartIndex}
          />
        </>
      )}
    </div>
  );
}

const TableSkeleton = ({ columns }: { columns: number }) => (
  <div className="w-full rounded-md border-y border-white/10">
    <Table>
      <TableHeader>
        <TableRow>
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead
              key={`skeleton-header-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
            >
              <div className="h-7 w-full bg-white/10 rounded animate-pulse" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: columns }).map((_, rowIndex) => (
          <TableRow
            key={`skeleton-row-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              rowIndex
            }`}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell
                key={`skeleton-cell-${rowIndex}-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  colIndex
                }`}
              >
                <div className="h-7 w-full bg-white/10 rounded animate-pulse" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);

export const PaginationControls = ({
  pageCount,
  rowCount,
  pageIndex,
  onPageClick,
  pageStartIndex,
  setPageStartIndex,
}: {
  pageIndex: number;
  pageCount: number;
  rowCount: number;
  onPageClick: (pageIndex: number) => void;
  pageStartIndex: number;
  setPageStartIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  return (
    <div className="my-4 flex items-center justify-between space-x-2 px-4 py-2 text-sm">
      <div className="text-interface-300">
        Showing {pageIndex * 10 + 1} -{' '}
        {Math.min(Math.min((pageIndex + 1) * 10, pageCount * 10), rowCount)} of{' '}
        {rowCount} results
      </div>

      {pageCount > 1 ? (
        <div className="flex items-center">
          {pageIndex > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                onPageClick(pageIndex - 1);
                setPageStartIndex((prev) => Math.max(prev - 1, 0));
              }}
            >
              Previous
            </Button>
          )}
          {Array.from(
            { length: Math.min(pageCount, 5) },
            (_, i) => i + Math.max(pageStartIndex, 0),
          ).map((index) => (
            <button
              type="button"
              onClick={() => {
                onPageClick(index);
                setPageStartIndex((prev: number) =>
                  Math.min(prev, pageCount - 5),
                );
              }}
              className={cn(
                'text-white/60 grid aspect-square h-8 place-items-center',
                pageIndex === index && 'bg-zinc-700 text-white/80 rounded-md',
              )}
              key={index}
            >
              {index + 1}
            </button>
          ))}
          {pageIndex + 1 < pageCount && (
            <Button
              variant="outline"
              onClick={() => {
                onPageClick(pageIndex + 1);
                setPageStartIndex((prev: number) =>
                  Math.min(prev + 1, pageCount - 5),
                );
              }}
            >
              Next
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
};
