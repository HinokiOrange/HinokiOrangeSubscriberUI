import { children, Component, For, JSX, JSXElement } from "solid-js";

export const TableRow: Component<{ children?: JSX.Element }> = ({
  children,
}) => {
  return <tr class="border-b hover:bg-orange-200">{children}</tr>;
};
export const TableCell: Component<{ children?: JSX.Element }> = ({
  children,
}) => {
  return (
    <td class=" px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {children}
    </td>
  );
};

export const Table: Component<{
  fields: Array<string>;
  children?: JSX.Element;
}> = ({ fields, children }) => {
  return (
    <table class="min-w-full">
      <thead class="border-b">
        <tr>
          <For each={fields}>
            {(Name) => (
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                {Name}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};
