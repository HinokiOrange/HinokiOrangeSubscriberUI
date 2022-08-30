import { Component, createEffect, createSignal, For, onMount } from "solid-js";
import { Fetch } from ".";
import { Checker, Linker } from "./Misc";
import { useRoute } from "./Route";
import { Table, TableCell, TableCollapse, TableRow } from "./Table";

const NovelTableFields = ["Name", "URL", "IsFinished", "LastUpdated"];

const NovelEntry: Component<{ id: string }> = ({ id }) => {
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

  const { Push } = useRoute();

  onMount(() => {
    Fetch(`/module/NovelDownloader/${id}`)
      .then((r) => r.json())
      .then((j) => setEntry(j));
  });
  return (
    <TableRow
      onClick={() =>
        Push({ name: entry().Data.Name, component: Novel, props: { id: id } })
      }
    >
      <TableCell align="left">
        <>{entry().Data.Name}</>
      </TableCell>
      <TableCell align="left">
        <Linker url={entry().Data.URL}></Linker>
      </TableCell>
      <TableCell>
        <Checker value={entry().Data.IsFinished}></Checker>
      </TableCell>
      <TableCell>
        <> {new Date(entry().Latest * 1000).toLocaleString("en-US")}</>
      </TableCell>
    </TableRow>
  );
};

// list
export const NovelList: Component = () => {
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

type Chapter = {
  Chapter: {
    Name: string;
    URL: string;
    ID: string;
  };
  IsCached: boolean;
  IsWritten: boolean;
};

const Novel: Component<{ id: string }> = ({ id }) => {
  const fields = ["Name", "URL", "ID", "IsCached", "IsWritten"];
  const [chapters, setChapters] = createSignal<{
    Chapters: {
      [key: string]: Chapter;
    };
    Volumes: Array<{
      Name: string;
      ID: string;
      Chapters: Array<{ Name: string; URL: string; ID: string }>;
    }>;
    IsNeedUpdate: boolean;
  }>({ Chapters: {}, Volumes: [], IsNeedUpdate: false }, { equals: false });

  onMount(() => {
    Fetch(`/module/NovelDownloader/${id}/detail`)
      .then((r) => r.json())
      .then((j) => setChapters(j));
  });

  return (
    <Table fields={fields}>
      <For each={chapters().Volumes}>
        {({ Name, ID, Chapters }, i) => (
          <TableCollapse text={Name == "*" ? `Volume: ${ID}` : Name}>
            <For each={Chapters}>
              {({ ID }) => (
                <Chapter chapter={chapters().Chapters[ID]}></Chapter>
              )}
            </For>
          </TableCollapse>
        )}
      </For>
    </Table>
  );
};

const Chapter: Component<{ chapter: Chapter }> = ({ chapter }) => {
  return (
    <TableRow>
      <TableCell align="left">
        <>{chapter.Chapter.Name}</>
      </TableCell>
      <TableCell align="left">
        <Linker url={chapter.Chapter.URL}></Linker>
      </TableCell>
      <TableCell>
        <>{chapter.Chapter.ID}</>
      </TableCell>
      <TableCell>
        <Checker value={chapter.IsCached}></Checker>
      </TableCell>
      <TableCell>
        <Checker value={chapter.IsWritten}></Checker>
      </TableCell>
    </TableRow>
  );
};
