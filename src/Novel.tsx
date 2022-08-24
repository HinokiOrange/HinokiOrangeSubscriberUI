import { Component, createSignal, For, onMount } from "solid-js";
import { Fetch } from ".";
import { useRoute } from "./Route";
import { Table, TableCell, TableRow } from "./Table";

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
    IsNeedUpdate: boolean;
  }>({ Chapters: {}, IsNeedUpdate: false }, { equals: false });

  onMount(() => {
    Fetch(`/module/NovelDownloader/${id}/detail`)
      .then((r) => r.json())
      .then((j) => setChapters(j));
  });
  return (
    <Table fields={fields}>
      <For each={Object.values(chapters().Chapters)}>
        {(ch) => <Chapter chapter={ch}></Chapter>}
      </For>
    </Table>
  );
};

const Chapter: Component<{ chapter: Chapter }> = ({ chapter }) => {
  return (
    <TableRow>
      <TableCell>
        <>{chapter.Chapter.Name}</>
      </TableCell>
      <TableCell>
        <>{chapter.Chapter.URL}</>
      </TableCell>
      <TableCell>
        <>{chapter.Chapter.ID}</>
      </TableCell>
      <TableCell>
        <>{chapter.IsCached}</>
      </TableCell>
      <TableCell>
        <>{chapter.IsWritten}</>
      </TableCell>
    </TableRow>
  );
};
