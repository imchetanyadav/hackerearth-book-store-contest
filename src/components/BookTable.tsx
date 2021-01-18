import * as React from "react";
// Using react-table first time and due to time constraints haven't researched much and might not be using it in best way
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";
import { useIndexedDB } from "react-indexed-db";

import { Book } from "../App";

interface Props {
  data: Array<Book>;
}

function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}: {
  globalFilter: any;
  setGlobalFilter: any;
}) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="mb-5">
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        className="p-2 border-b-2 w-full"
        placeholder="Search"
      />
    </div>
  );
}

const BookTable: React.FC<Props> = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Rating",
        accessor: "average_rating",
      },
      {
        Header: "Price",
        accessor: "price",
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
    allColumns,
    setGlobalFilter,
  } = useTable(
    {
      //@ts-ignore
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns,
        {
          id: "add",
          Header: () => <div />,
          Cell: ({ row }: { row: any }) => <AddToCard {...row.original} />,
        },
      ]);
    }
  );

  return (
    <div className="p-8">
      <div className="flex flex-col">
        <GlobalFilter
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        <div className="flex mb-4">
          <div className="font-bold mr-3">Columns: </div>
          {allColumns
            .filter((c) => c.id !== "title" && c.id !== "add")
            .map((column) => (
              <div key={column.id} className="mr-4">
                <label>
                  <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
                  {column.Header}
                </label>
              </div>
            ))}
        </div>
      </div>
      <div
        className="block min-w-full shadow rounded-lg overflow-hidden"
        style={{ maxWidth: "100%" }}
      >
        <table {...getTableProps()} className="min-w-full leading-normal">
          <thead className="hidden lg:table-header-group">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`${
                      column.id === "title" ? "text-left" : "text-center"
                    } px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`}
                    style={{ minWidth: 150 }}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
                <th></th>
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: any, i: any) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className="flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap py-2 lg:py-0 border-b border-gray-200 bg-white"
                >
                  {row.cells.map((cell: any) => (
                    <td
                      {...cell.getCellProps()}
                      className={`${
                        cell.column.id === "title"
                          ? "text-left truncate"
                          : "text-center"
                      } px-5 py-1 lg:py-5 text-sm w-full lg:w-auto flex flex-wrap lg:table-cell`}
                    >
                      {cell.column.id === "average_rating" ? (
                        <div className="flex justify-center items-center">
                          <span className="text-orange-500">
                            {getStarsFromRating(cell.value)}
                          </span>{" "}
                          <span className="text-xs">({cell.value})</span>
                        </div>
                      ) : cell.column.id === "price" ? (
                        <>₹{cell.value}</>
                      ) : cell.column.id === "title" ? (
                        <>{cell.value.length > 80 ? `${cell.value.substring(0, 80)}...` : cell.value}</>
                      ) : (
                        <span>{cell.render("Cell")}</span>
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStarsFromRating = (rating: number) => {
  if (rating && typeof rating === "number" && rating >= 1) {
    const n = Math.floor(rating);
    const str = [1, 2, 3, 4, 5].reduce(
      (acc, v) => (v <= n ? (acc += "★") : (acc += "☆")),
      ""
    );
    return str;
  } else return "☆☆☆☆☆";
};

const AddToCard = (props: Book) => {
  const { add } = useIndexedDB("cart");

  return (
    <div>
      <button
        className="cursor-pointer"
        onClick={() => {
          add({
            title: props.title,
            price: props.price,
            rating: props.average_rating,
          });
        }}
      >
        + Add
      </button>
    </div>
  );
};

export default BookTable;
