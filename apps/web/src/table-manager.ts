import { atom } from "nanostores";

import {
  type RowData,
  type TableOptions,
  type TableOptionsResolved,
  type ColumnHelper,
  createTable,
  createColumnHelper,
  getCoreRowModel,
} from "@tanstack/table-core";

import type { FeedbackContract, ProjectContract } from "./types";
import type State from "./state";

type TableManagerProperties = {
  state: State;
};

type FeedbackIn = FeedbackContract["output"]["one"];

const flexRender = <TProps extends object>(comp: any, props: TProps) => {
  if (typeof comp === "function") {
    return comp(props);
  }
  return comp;
};

const useTable = <TData extends RowData>(options: TableOptions<TData>) => {
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {},
    onStateChange: () => { },
    renderFallbackValue: null,
    ...options,
  };

  const table = createTable<TData>(resolvedOptions);

  const state = atom(table.initialState);

  state.subscribe((currentState) => {
    table.setOptions((prev) => ({
      ...prev,
      ...options,
      state: {
        ...currentState,
        ...options.state,
      },
      onStateChange: (updater) => {
        if (typeof updater === "function") {
          const newState = updater(currentState);
          state.set(newState);
        } else {
          state.set(updater);
        }
        options.onStateChange?.(updater);
      },
    }));
  });

  return table;
};

export class TableFeedbackManager {
  private state: State;
  private columnHelper: ColumnHelper<FeedbackIn>;
  private columns;
  private modalElement = document.querySelector(
    ".table-popup",
  ) as HTMLDivElement;
  private modalCloseElement = document.querySelector(
    ".table-popup-close",
  ) as HTMLButtonElement;
  private wrapperElement = document.querySelector(
    ".table-popup-table-wrapper",
  ) as HTMLDialogElement;
  private tableHeaderSelectedCity = document.querySelector(
    ".table-selection-info .selected-city",
  ) as HTMLParagraphElement;
  private tableHeaderSelectedProject = document.querySelector(
    ".table-selection-info .selected-project",
  ) as HTMLParagraphElement;

  constructor({ state }: TableManagerProperties) {
    this.state = state;
    this.columnHelper = createColumnHelper<FeedbackIn>();
    this.columns = this.getColumns();
    this.modalCloseElement.addEventListener("click", () => this.close());
  }

  private getColumns() {
    return [
      this.columnHelper.accessor("description", {
        header: "Описание",
      }),
      this.columnHelper.accessor("status", {
        header: "Статус",
        cell: (info) => {
          if (info.row.original.feedback_status_comment) {
            return `${info.getValue()["translation"]}<br/>(${info.row.original.feedback_status_comment})`;
          }
          return info.getValue()["translation"];
        },
      }),
      this.columnHelper.accessor("created_at", {
        header: "Дата",
        cell: (info) => new Date(info.getValue()).toLocaleString("ru"),
      }),
    ];
  }

  public close() {
    this.modalElement.classList.remove("show");
    // document.body.style.overflow = "";
  }

  public renderTable(project: ProjectContract["output"]["all"][0] | null) {
    if (project === null) {
      return;
    }

    this.tableHeaderSelectedCity.textContent = project.administrative_unit;
    this.tableHeaderSelectedProject.textContent = project.title;

    const tableElement = document.createElement("table");
    tableElement.className = "table-popup-table";
    const theadElement = document.createElement("thead");
    theadElement.className = "table-popup-table-header";
    const tbodyElement = document.createElement("tbody");
    tbodyElement.className = "table-popup-table-body";

    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);

    const table = useTable({
      data: this.state.issuesByAllProjects[project.id] ?? [],
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
    });

    const headerGroups = table?.getHeaderGroups();

    headerGroups.forEach((headerGroup) => {
      const trElement = document.createElement("tr");
      trElement.className = "table-popup-table-header-row";
      headerGroup.headers.forEach((header) => {
        const thElement = document.createElement("th");
        thElement.className = "table-popup-table-header-cell";
        thElement.innerHTML = header.isPlaceholder
          ? ""
          : flexRender(header.column.columnDef.header, header.getContext());
        trElement.appendChild(thElement);
      });
      theadElement.appendChild(trElement);
    });

    table?.getRowModel().rows.forEach((row) => {
      const trElement = document.createElement("tr");
      trElement.className = "table-popup-table-body-row";

      row.getVisibleCells().forEach((cell, index) => {
        const tdElement = document.createElement("td");
        tdElement.setAttribute(
          "label",
          headerGroups[0]?.headers[
            index
          ]?.column.columnDef.header?.toString() ?? "",
        );
        tdElement.className = "table-popup-table-body-cell";
        tdElement.innerHTML = flexRender(
          cell.column.columnDef.cell,
          cell.getContext(),
        );
        trElement.appendChild(tdElement);
      });
      tbodyElement.appendChild(trElement);
    });

    this.wrapperElement.innerHTML = "";
    this.wrapperElement.appendChild(tableElement);

    this.modalElement.classList.add("show");
    // document.body.style.overflow = "hidden";
  }
}
