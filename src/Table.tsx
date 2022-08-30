import {
  createContext,
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  ParentComponent,
  Show,
  useContext,
} from "solid-js";
import { FocusContextConstructor, FocusContext, useFocus } from "./Misc";

const createTableRowContext = (clickHandler?: () => void) => {
  const [clicks, setClicks] = createSignal(0);
  const [cellPool, updateCellPool] = createSignal(0);

  const getCellId = () => {
    const i = cellPool();
    updateCellPool(i + 1);
    return i;
  };

  const click = () => setClicks(clicks() + 1);
  const isClick = () => clicks() > 0;

  return { getCellId, clickHandler: clickHandler ?? (() => {}) } as const;
};
const TableRowContext = createContext(createTableRowContext());
const useTableRow = () => useContext(TableRowContext);

const TableContextConstructor = (fieldLength: number) => {
  const [expand, setExpand] = createSignal(0);

  const [collapsePool, updateCollapsePool] = createSignal(0);

  const [rowPool, updateRowPoll] = createSignal(0);
  const [focusedRow, setFocusedRow] = createSignal(0);
  const [selectedRow, setSelectedRow] = createSignal(-1);

  const getCollapseId = () => {
    const i = collapsePool();
    updateCollapsePool(i + 1);
    return i;
  };

  const getRowId = () => {
    const i = rowPool();
    updateRowPoll(i + 1);
    return i;
  };

  const prevRow = () => {
    if (focusedRow() == 0) {
      return;
    }
    setFocusedRow(focusedRow() - 1);
  };

  const nextRow = () => {
    if (focusedRow() >= rowPool() - 1) {
      return;
    }
    setFocusedRow(focusedRow() + 1);
  };

  const selectRow = () => {
    setSelectedRow(focusedRow());
  };

  const nextExpand = () => {
    if (expand() >= collapsePool() - 1) {
      return;
    }
    setExpand(expand() + 1);
  };

  const prevExpand = () => {
    if (expand() == 0) {
      return;
    }
    setExpand(expand() - 1);
  };

  return {
    fieldLength,

    getCollapseId,
    nextExpand,
    prevExpand,
    expand,
    setExpand,

    getRowId,
    setFocusedRow,
    focusedRow,
    prevRow,
    nextRow,
    selectedRow,
    selectRow,
  } as const;
};
const TableContext = createContext(TableContextConstructor(0));
const useTable = () => useContext(TableContext);

export const TableRow: ParentComponent<{
  onClick?: () => void;
}> = (props) => {
  const { getRowId, selectedRow, setFocusedRow, focusedRow } = useTable();
  const id = getRowId();
  const rowContext = createTableRowContext(props.onClick);
  const focusContext = FocusContextConstructor();
  createEffect(() => {
    selectedRow() == id && rowContext.clickHandler();
  });
  createEffect(() => {
    focusContext.isFocused() && setFocusedRow(id);
  });
  createEffect(() => {
    focusContext.setFocus(focusedRow() == id);
  });

  return (
    <TableRowContext.Provider value={rowContext}>
      <FocusContext.Provider value={focusContext}>
        {props.children}
      </FocusContext.Provider>
    </TableRowContext.Provider>
  );
};
export const TableCell: ParentComponent<{
  align?: "center" | "left" | "right";
}> = (props) => {
  const { clickHandler, getCellId } = useTableRow();
  const id = getCellId();
  const align = props.align ?? "center";
  let elem: HTMLDivElement;
  const { setFocus, isFocused, isScrolled } = useFocus();
  if (id == 0) {
    createEffect(() => {
      isFocused() && isScrolled() && elem.scrollIntoView({ block: "center" });
    });
  }

  return (
    <div
      ref={elem}
      class="px-2"
      classList={{
        "bg-secondary-dark text-white font-bold py-3": isFocused(),
        "text-center flex items-center justify-center": align == "center",
        "text-left flex items-start justify-start": align == "left",
        "text-right flex items-end justify-end": align == "right",
      }}
      onmousemove={() => setFocus(true, true)}
      onClick={clickHandler}
    >
      {props.children}
    </div>
  );
};

export const TableCollapse: ParentComponent<{
  text: string;
}> = (props) => {
  const { fieldLength, getCollapseId, expand, setExpand } = useTable();
  const id = getCollapseId();

  return (
    <>
      <div
        class="h-8 text-lg bg-primary-light text-primary-text border-b border-primary hover:bg-secondary hover:text-secondary-text "
        style={{
          "grid-column": `span ${fieldLength}`,
        }}
        classList={{
          "top-8": expand() == id && id == 0,
          "top-16": expand() == id && id > 0,
          "pointer-events-none sticky left-0": expand() == id,
          "sticky top-8 left-0": id == expand() - 1,
          "sticky bottom-0 left-0": id == expand() + 1,
        }}
        onclick={() => setExpand(id)}
      >
        <div class="h-full flex items-center justify-center">{props.text}</div>
      </div>
      <Show when={expand() == id}>{props.children}</Show>
    </>
  );
};

export const Table: ParentComponent<{ fields: Array<string> }> = (props) => {
  const { fields } = props;
  const context = TableContextConstructor(fields.length);
  const { nextRow, prevRow, selectRow, nextExpand, prevExpand } = context;

  const onKey = (k: KeyboardEvent) => {
    switch (k.key) {
      case "ArrowUp":
        prevRow();
        break;
      case "ArrowDown":
        nextRow();
        break;
      case "ArrowRight":
        nextExpand();
        break;
      case "ArrowLeft":
        prevExpand();
        break;
      case "Enter":
        selectRow();
        break;
    }
  };

  onMount(() => {
    window.addEventListener("keydown", onKey);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", onKey);
  });

  return (
    <TableContext.Provider value={context}>
      <div
        class="ho-table-content grid max-h-full h-fit w-full overflow-y-scroll"
        style={{
          "grid-template-columns": `repeat(${fields.length}, auto)`,
        }}
      >
        <For each={fields}>
          {(Name) => (
            <div class="text-center h-8 bg-primary-dark text-primary-text sticky top-0 text-xl text-bold">
              {Name}
            </div>
          )}
        </For>
        {props.children}
      </div>
    </TableContext.Provider>
  );
};
