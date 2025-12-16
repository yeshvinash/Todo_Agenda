import React, { useState, useMemo } from "react";
import { useTodo } from "../../hooks/useTodo";
import { CheckCircle, Circle, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import Button from "../../components/Button/Button";
import { Input } from "../../components/CustomInput/CustomInput";
import Dropdown from "../../components/CustomDropDown/Dropdown";
import { cn } from "../../lib/utils";
import { sortOptions } from "../../components/Data/Consts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../components/Pagination/Pagination";

const ITEMS_PER_PAGE = 5;

const TodoTable: React.FC = () => {
  const {
    todos,
    setSearch,
    editTodo,
    toggleComplete,
    deleteTodo,
    filteredData,
    search,
    sortBy,
    isChecked,
    setSortBy,
    deleteAllTodos,
    deleteCompletedTodo,
  } = useTodo();

  const [currentPage, setCurrentPage] = useState(1);

  // Handle change for search field
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // Sort todos based on selected option
  const sortedTodos = useMemo(() => {
    const todosCopy = [...filteredData];

    switch (sortBy) {
      case "todo-asc":
        return todosCopy.sort((a, b) =>
          a.todo.toLowerCase().localeCompare(b.todo.toLowerCase())
        );

      case "todo-desc":
        return todosCopy.sort((a, b) =>
          b.todo.toLowerCase().localeCompare(a.todo.toLowerCase())
        );

      case "status-completed":
        return todosCopy.sort(
          (a, b) => (b.isCompleted ? 1 : 0) - (a.isCompleted ? 1 : 0)
        );

      case "status-active":
        return todosCopy.sort(
          (a, b) => (a.isCompleted ? 1 : 0) - (b.isCompleted ? 1 : 0)
        );

      default:
        return todosCopy;
    }
  }, [filteredData, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(sortedTodos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTodos = sortedTodos.slice(startIndex, endIndex);
  const completedCount = filteredData.filter((item) => item.isCompleted).length;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the start
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Helper to convert todo.id to number | null for functions that expect number
  const getIdAsNumber = (id: number | string | undefined): number | null => {
    if (id === undefined) return null;
    if (typeof id === "number") return id;
    const parsed = Number(id);
    return isNaN(parsed) ? null : parsed;
  };

  // Early return for empty todos (after all hooks)
  if (!todos || todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Circle size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium">No Todos Available</p>
        <p className="text-sm">Start by adding a new task 🚀</p>
      </div>
    );
  }

  return (
    <div className=" rounded-xl ">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-50 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Todo List</h2>
        <p className="text-sm text-gray-500">
          Manage your daily tasks efficiently
        </p>
      </div>
      {/* Loader and Data Indicator Section */}
      <div className="mb-6 p-4 rounded-lg flex gap-6 items-center bg-slate-900 shadow-lg min-h-[60px] relative">
        <div>
          <span className="font-semibold text-gray-300">Total:</span>{" "}
          <span className="text-white">{filteredData.length}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-300">Active:</span>{" "}
          <span className="text-green-400">
            {filteredData.length - completedCount}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-300">Completed:</span>{" "}
          <span className="text-yellow-400">{completedCount}</span>
        </div>
        {sortBy && (
          <div className="text-blue-400 font-semibold flex items-center gap-1">
            <svg
              className="w-4 h-4 inline"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
            <span>Sorted by:</span>
            <span className="ml-1">
              {sortOptions.find((opt) => opt.value === sortBy)?.label}
            </span>
          </div>
        )}
        {/* Data state indicator */}
        <div
          className={`ml-auto px-3 py-1 rounded ${
            filteredData.length > 0
              ? "bg-green-700 text-white"
              : "bg-red-700 text-white"
          } text-sm font-bold`}
        >
          {filteredData.length > 0 ? "Data Loaded" : "No Todos"}
        </div>
      </div>
      {/* <div className="bg-primary-100">dddf</div> */}

      <div className="flex items-center gap-3 mb-4 justify-between">
        <Input
          type="text"
          placeholder="search"
          name="search"
          value={search}
          onChange={handleSearchChange}
          variant="success"
          size="lg"
          className="bg-transparent  max-w-[300px]"
        />
        <div className="inline-flex items-center gap-2 shrink-0">
          <label className="font-medium text-gray-700">Sort by:</label>
          <Dropdown
            options={sortOptions}
            placeholder="Select sorting..."
            value={sortBy}
            onChange={(value) => handleSortChange(value as string)}
            className="min-w-52"
          />
          <Button
            type="button"
            variant={"secondary"}
            className={cn(
              isChecked ? "cursor-default" : "cursor-not-allowed",
              "h-10"
            )}
            onClick={deleteCompletedTodo}
            disabled={!isChecked}
            size={"md"}
          >
            Delete Selected
          </Button>
          <Button
            type="button"
            size={"md"}
            className="h-10"
            onClick={deleteAllTodos}
          >
            Delete All
          </Button>
        </div>
      </div>

      {/* Table */}
      {sortedTodos && sortedTodos.length > 0 ? (
        <div className="overflow-x-auto shadow-lg ">
          <table className="min-w-full text-sm bg-white ">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-2 text-left font-semibold">#</th>
                <th className="px-6 py-2 text-left font-semibold">Completed</th>
                <th className="px-6 py-2 text-left font-semibold">Todo</th>
                <th className="px-6 py-2 text-left font-semibold">Status</th>
                <th className="px-6 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="[&>tr>td]:min-w-[150px] border-b divide-y">
              {paginatedTodos.map((todo, index) => (
                <tr key={todo.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-gray-600">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-6 py-4 ">
                    <Checkbox
                      variant="default"
                      checked={todo.isCompleted}
                      onClick={() => toggleComplete(getIdAsNumber(todo.id))}
                    />
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`font-medium ${
                        todo.isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.todo}
                    </span>
                  </td>

                  <td className="px-6 py-4 ">
                    <button
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition ${
                        todo.isCompleted
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      }`}
                    >
                      {todo.isCompleted ? (
                        <CheckCircle size={14} />
                      ) : (
                        <Circle size={14} />
                      )}
                      {todo.isCompleted ? "Completed" : "Pending"}
                    </button>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2 [&>button]:min-w-[110px]">
                    <Button
                      type="button"
                      onClick={() => editTodo(getIdAsNumber(todo.id))}
                      variant={"primary"}
                    >
                      <Edit size={14} />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      onClick={() => deleteTodo(getIdAsNumber(todo.id))}
                      variant={"danger"}
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <p className="text-2xl capitalize border rounded-md shadow-innerk p-2 min-h-20">
            No Todos available:)
          </p>
        </div>
      )}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 ">
            Showing {startIndex + 1} to {Math.min(endIndex, sortedTodos.length)}{" "}
            of {sortedTodos.length} todos
          </div>
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(1);
                  }}
                  aria-label="Go to first page"
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                >
                  First
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePrevious();
                  }}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {pageNumbers.map((page, index) => {
                if (page === "ellipsis") {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(page as number);
                      }}
                      isActive={currentPage === page}
                      size="sm"
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
                    handleNext();
                  }}
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(totalPages);
                  }}
                  aria-label="Go to last page"
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50"
                  )}
                >
                  Last
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default TodoTable;
