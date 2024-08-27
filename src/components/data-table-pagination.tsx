"use client"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const DataTablePagination = ({
  page,
  numberOfPages,
  hasNextPage,
}: {
  page: number;
  numberOfPages: number;
  hasNextPage: boolean;
}) => {
  const isFirstPage = page === 1;
  const isLastPage = page === numberOfPages;
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Pagination className="pb-2">
      <PaginationContent>
        {!isFirstPage && (
          <PaginationItem>
            <Button
              onClick={() => updatePage(page - 1)}
              size="sm"
              variant={"outline"}
            >
              <ChevronLeft className="size-4" />
            </Button>
          </PaginationItem>
        )}
        {!isFirstPage && (
          <PaginationItem>
            <Button
              onClick={() => updatePage(page - 1)}
              size="sm"
              variant={"outline"}
            >
              {page - 1}
            </Button>
          </PaginationItem>
        )}

        <PaginationItem>
          <Button onClick={() => updatePage(page)} size={"sm"}>
            {page}
          </Button>
        </PaginationItem>

        {page + 1 <= numberOfPages && (
          <PaginationItem>
            <Button
              onClick={() => updatePage(page + 1)}
              size="sm"
              variant={"outline"}
            >
              {page + 1}
            </Button>
          </PaginationItem>
        )}
        {page + 2 <= numberOfPages && (
          <PaginationItem>
            <Button
              onClick={() => updatePage(page + 2)}
              size={"sm"}
              variant={"outline"}
            >
              {page + 2}
            </Button>
          </PaginationItem>
        )}

        {page + 2 < numberOfPages && <PaginationEllipsis />}

        {!isLastPage && hasNextPage && (
          <PaginationItem>
            <Button
              onClick={() => updatePage(page + 1)}
              size={"sm"}
              variant={"outline"}
            >
              <ChevronRight className="size-4" />
            </Button>
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};
