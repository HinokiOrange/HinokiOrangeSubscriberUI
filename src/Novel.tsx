import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
} from "solid-js";
import { Fetch } from ".";
import { Table, TableCell, TableRow } from "./Table";

const NovelTableFields = ["Name", "URL", "IsFinished", "LastUpdated"];

export const NovelEntry: Component<{ id: string }> = ({ id }) => {
  const [entry, setEntry] = createSignal<{
    Latest: number;
    Data: {
      Name: string;
      URL: string;
      IsFinished: boolean;
    };
  }>(
    { Latest: 0, Data: { Name: "", URL: "", IsFinished: false } },
    { equals: false }
  );

  onMount(() => {
    Fetch(`/module/NovelDownloader/${id}`)
      .then((r) => r.json())
      .then((j) => setEntry(j));
  });
  return (
    <TableRow>
      <TableCell>
        <>{entry().Data.Name}</>
      </TableCell>
      <TableCell>
        <a href={entry().Data.URL} target="_blank">
          {entry().Data.URL}
        </a>
      </TableCell>
      <TableCell>
        <input
          type="checkbox"
          checked={entry().Data.IsFinished}
          class="pointer-events-none"
        ></input>
      </TableCell>
      <TableCell>
        <> {new Date(entry().Latest * 1000).toLocaleString("en-US")}</>
      </TableCell>
    </TableRow>
  );
};

// list
export const Novel: Component = () => {
  const [list, setList] = createSignal<Array<string>>([], { equals: false });
  onMount(() => {
    Fetch("/module/NovelDownloader")
      .then((r) => r.json())
      .then((j) => Object.keys(j))
      .then((arr) => setList(arr));
  });

  return (
    <Table fields={NovelTableFields}>
      <For each={list()}>{(id) => <NovelEntry id={id}></NovelEntry>}</For>
    </Table>
  );
};
