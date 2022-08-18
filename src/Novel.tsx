import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  onMount,
} from "solid-js";
import { Fetch } from ".";
import { useRoute } from "./Route";

// list
export const Novel: Component = () => {
  const [list, setList] = createSignal<
    {
      Name: string;
      URL: string;
      IsFinished: boolean;
    }[]
  >([], { equals: false });
  const { Push } = useRoute();
  createEffect(() => {
    console.log(list());
  });
  onMount(() => {
    Fetch("/novel")
      .then((r) => r.json())
      .then((j) => setList(j));
  });

  return (
    <div>
      <table class="min-w-full">
        <thead class="border-b">
          <tr>
            <th
              scope="col"
              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              Name
            </th>
            <th
              scope="col"
              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              URL
            </th>
            <th
              scope="col"
              class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
            >
              IsFinished
            </th>
          </tr>
        </thead>
        <tbody>
          <For each={list()} fallback={<div>Loading...</div>}>
            {({ Name, URL, IsFinished }) => (
              <tr
                class="border-b hover:bg-gray-100"
                onclick={() =>
                  Push({
                    name: Name,
                    component: NovelItem,
                    props: { name: Name },
                  })
                }
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {Name}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <a href={URL} target="_blank">
                    {URL}
                  </a>
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    class="pointer-events-none"
                    checked={IsFinished}
                  ></input>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};

const NovelItem: Component<{ name: string }> = ({ name }) => {
  const [detail, setDetail] = createSignal<{
    Name: string;
    URL: string;
    IsFinished: boolean;
    Interval: number;
    Chapters: {
      [id: string]: {
        Name: string;
        URL: string;
        ID: string;
        IsCached: boolean;
        IsWritten: boolean;
      };
    };
  }>(
    { Name: "", URL: "", IsFinished: false, Interval: 0, Chapters: {} },
    { equals: false }
  );
  const chapters = createMemo(() => detail().Chapters ?? {});
  onMount(() => {
    Fetch(`/novel/${name}`)
      .then((r) => r.json())
      .then((j) => setDetail(j));
  });
  return (
    <>
      <div>
        <For each={Object.entries(chapters())} fallback={<div>Loading...</div>}>
          {([_, { Name }]) => <div>{Name}</div>}
        </For>
      </div>
    </>
  );
};
