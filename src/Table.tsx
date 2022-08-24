import {
  Component,
  createContext,
  createEffect,
  createSignal,
  For,
  JSX,
  useContext,
} from "solid-js";

const createTableRowContext = () => {
  const [hover, setHover] = createSignal(false);
  const [clicks, setClicks] = createSignal(0);
  const click = () => setClicks(clicks() + 1);
  return { hover, setHover, click, clicks } as const;
};

const TableRowContext = createContext(createTableRowContext());
export const useTableRow = () => useContext(TableRowContext);

export const TableRow: Component<{
  children: any;
  onClick?: () => void;
}> = (props) => {
  const { onClick } = props;
  const context = createTableRowContext();
  const { clicks } = context;
  createEffect(() => {
    clicks() > 0 && (onClick ?? (() => {}))();
  });
  return (
    <TableRowContext.Provider value={context}>
      {props.children}
    </TableRowContext.Provider>
  );
};
export const TableCell: Component<{ children?: JSX.Element }> = ({
  children,
}) => {
  const { click, setHover, hover } = useTableRow();
  return (
    <div
      class="text-center"
      classList={{ "bg-black": hover() }}
      onmouseover={() => setHover(true)}
      onmouseout={() => setHover(false)}
      onClick={() => click()}
    >
      {children}
    </div>
  );
};

export const Table: Component<{
  fields: Array<string>;
  children: any;
}> = (props) => {
  const { fields } = props;
  return (
    <div
      class="grid h-full w-full bg-slate-100 rounded overflow-y-scroll"
      style={{
        "grid-template-columns": `repeat(${fields.length}, auto)`,
      }}
    >
      <For each={fields}>
        {(Name) => (
          <div class="text-center bg-slate-100 sticky top-0 text-xl text-bold">
            {Name}
          </div>
        )}
      </For>
      {props.children}
    </div>
  );
};
