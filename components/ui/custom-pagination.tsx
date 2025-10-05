"use client";

import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomPaginationProps) {
  // Generate page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Adjust this number to show more/fewer page buttons

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than our limit, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Current page is close to the beginning
      if (currentPage <= 3) {
        pageNumbers.push(2, 3);
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
      // Current page is close to the end
      else if (currentPage >= totalPages - 2) {
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      }
      // Current page is in the middle
      else {
        pageNumbers.push("ellipsis");
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push("ellipsis");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
          />
        </PaginationItem>

        {getPageNumbers().map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={`page-${page}`}>
              <PaginationLink
                href="#"
                isActive={currentPage === page}
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
