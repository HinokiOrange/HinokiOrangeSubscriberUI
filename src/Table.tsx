import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  For,
  on,
  onCleanup,
  onMount,
  ParentComponent,
  Show,
  useContext,
} from "solid-js";
import {
  createFocusContext,
  FocusContext,
  useFocus,
  createIdPool,
  createFocusedId,
} from "./Misc";

const createTableRowContext = (rowId: number, clickHandler?: () => void) => {
  const { getId: getCellId } = createIdPool();

  return {
    rowId,

    getCellId,

    clickHandler: clickHandler ?? (() => {}),
  } as const;
};
const TableRowContext = createContext(createTableRowContext(-1));
const useTableRow = () => useContext(TableRowContext);

const createTableContext = (fieldLength: number) => {
  const rowPool = createIdPool();
  const focusedRow = createFocusedId(rowPool.size);
  const [getEnteredRowId, setEnteredRowId] = createSignal(-1, {
    equals: false,
  });

  const collapsePool = createIdPool();
  const focusedCollapse = createFocusedId(collapsePool.size, {
    onSet() {
      // clean row to re-create rows in new collapse
      rowPool.clean();
      focusedRow.set(0, true);
    },
  });

  return {
    fieldLength,

    rowPool,
    focusedRow,
    getEnteredRowId,
    enterRow() {
      setEnteredRowId(focusedRow.get());
    },

    collapsePool,
    focusedCollapse,
  } as const;
};
const TableContext = createContext(createTableContext(0));
const useTable = () => useContext(TableContext);

export const TableRow: ParentComponent<{
  onClick?: () => void;
}> = (props) => {
  const tableCtx = useTable();
  const rowCtx = createTableRowContext(tableCtx.rowPool.getId(), props.onClick);
  const focusCtx = createFocusContext();
  createEffect(() => {
    focusCtx.setFocus(tableCtx.focusedRow.get() == rowCtx.rowId);
  });

  createEffect(() => {
    tableCtx.getEnteredRowId() == rowCtx.rowId && rowCtx.clickHandler();
  });

  return (
    <TableRowContext.Provider value={rowCtx}>
      <FocusContext.Provider value={focusCtx}>
        {props.children}
      </FocusContext.Provider>
    </TableRowContext.Provider>
  );
};
export const TableCell: ParentComponent<{
  align?: "center" | "left" | "right";
}> = (props) => {
  const align = props.align ?? "center";
  let elem: HTMLDivElement;

  const tableCtx = useTable();
  const rowCtx = useTableRow();
  const focusCtx = useFocus();
  const cellId = rowCtx.getCellId();

  if (cellId == 0) {
    createEffect(() => {
      focusCtx.isFocused() &&
        tableCtx.focusedRow.needScroll() &&
        elem.scrollIntoView({ block: "center" });
    });
  }

  return (
    <div
      ref={elem}
      class="px-2"
      classList={{
        "bg-secondary-dark text-white font-bold py-3": focusCtx.isFocused(),
        "text-center flex items-center justify-center": align == "center",
        "text-left flex items-start justify-start": align == "left",
        "text-right flex items-end justify-end": align == "right",
      }}
      onmousemove={() => tableCtx.focusedRow.set(rowCtx.rowId)}
      onClick={rowCtx.clickHandler}
    >
      {props.children}
    </div>
  );
};

export const TableCollapse: ParentComponent<{
  text: string;
}> = (props) => {
  const tableCtx = useTable();
  const collapseId = tableCtx.collapsePool.getId();

  const isFirst = collapseId == 0;
  const isFocused = createMemo(
    () => tableCtx.focusedCollapse.get() == collapseId
  );
  const isPrevOfFocused = createMemo(
    () => collapseId == tableCtx.focusedCollapse.get() - 1
  );
  const isNextOfFocused = createMemo(
    () => collapseId == tableCtx.focusedCollapse.get() + 1
  );

  return (
    <>
      <div
        class="h-8 text-lg bg-primary-light text-primary-text border-b border-primary hover:bg-secondary hover:text-secondary-text "
        style={{
          "grid-column": `span ${tableCtx.fieldLength}`,
        }}
        classList={{
          "top-8": isFocused() && isFirst,
          "top-16": isFocused() && !isFirst,
          "pointer-events-none sticky left-0": isFocused(),
          "sticky top-8 left-0": isPrevOfFocused(),
          "sticky bottom-0 left-0": isNextOfFocused(),
        }}
        onclick={() => tableCtx.focusedCollapse.set(collapseId)}
      >
        <div class="h-full flex items-center justify-center">{props.text}</div>
      </div>
      <Show when={isFocused()}>{props.children}</Show>
    </>
  );
};

export const Table: ParentComponent<{ fields: Array<string> }> = (props) => {
  const { fields } = props;
  const context = createTableContext(fields.length);

  const onKey = (k: KeyboardEvent) => {
    switch (k.key) {
      case "ArrowUp":
        context.focusedRow.prev();
        break;
      case "ArrowDown":
        context.focusedRow.next();
        break;
      case "ArrowRight":
        context.focusedCollapse.next();
        break;
      case "ArrowLeft":
        context.focusedCollapse.prev();
        break;
      case "Enter":
        context.enterRow();
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
            <div class="text-center h-8 p-0.5 bg-slate-100 rounded text-primary-text sticky top-0 text-xl text-bold">
              <div class="rounded bg-primary-dark w-full h-full flex items-center justify-center">
                {Name}
              </div>
            </div>
          )}
        </For>
        {props.children}
      </div>
    </TableContext.Provider>
  );
};
