import {
  Component,
  createEffect,
  createRoot,
  createSignal,
  For,
  onMount,
} from "solid-js";
import { Novel } from "./Novel";
import { renderRoute, RouteProvider, useRoute } from "./Route";

const MenuRoot = createRoot(() => {
  const list = [{ name: "Novel", component: Novel }];
  const [index, setIndex] = createSignal(-1);
  const { SetRoot } = useRoute();
  createEffect(() => {
    if (index() >= 0) {
      const item = list[index()];
      SetRoot({ name: item.name, component: item.component });
    }
  });
  return { list, index, setIndex };
});

const MenuItem: Component<{
  name: string;
  component: Component;
  index: number;
}> = ({ name, component, index }) => {
  const { setIndex, index: selectedIndex } = MenuRoot;
  return (
    <li class="relative">
      <a
        class="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
        classList={{ "bg-black": index == selectedIndex() }}
        data-mdb-ripple="true"
        data-mdb-ripple-color="dark"
        onClick={(e) => {
          e.preventDefault();
          setIndex(index);
        }}
      >
        {name}
      </a>
    </li>
  );
};

const MenuBar: Component = () => {
  const { list } = MenuRoot;
  return (
    <div class="h-screen shadow-md bg-white px-1">
      <ul class="relative">
        <For each={list}>
          {(item, i) => (
            <MenuItem
              name={item.name}
              component={item.component}
              index={i()}
            ></MenuItem>
          )}
        </For>
      </ul>
    </div>
  );
};

const Main: Component = () => {
  const { setIndex } = MenuRoot;
  onMount(() => setIndex(0));

  const { routes, current } = useRoute();
  createEffect(() => {
    document.title = current().name;
  });
  return (
    <div class="flex flex-row">
      <MenuBar></MenuBar>
      <div class="flex flex-grow flex-col py-1 px-3">
        <nav class="bg-gray-100 px-5 py-3 rounded-md w-full">
          <ol class="list-reset flex">
            <For each={routes()}>
              {({ name }, i) => (
                <>
                  <li classList={{ "text-blue-600": current().name == name }}>
                    {name}
                  </li>
                  <span class="text-gray-500 mx-2">
                    {i() < routes().length - 1 ? "/" : ""}
                  </span>
                </>
              )}
            </For>
          </ol>
        </nav>
        <div>{renderRoute(current())}</div>
      </div>
    </div>
  );
};

const App: Component = () => {
  return (
    <RouteProvider>
      <Main></Main>
    </RouteProvider>
  );
};

export default App;
