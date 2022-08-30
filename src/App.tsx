import {
  Component,
  createEffect,
  createRoot,
  createSignal,
  For,
  Match,
  onMount,
  Show,
  Switch,
} from "solid-js";
import { NovelList } from "./Novel";
import { renderRoute, RouteProvider, useRoute } from "./Route";
import { OcThreebars2 } from "solid-icons/oc";
import {
  IoCaretForwardOutline,
  IoChevronBackOutline,
  IoMenuOutline,
} from "solid-icons/io";

const navRoot = createRoot(() => {
  const list = [{ name: "Novel", component: NovelList }];

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

const NavItem: Component<{
  name: string;
  component: Component;
  index: number;
}> = ({ name, component, index }) => {
  const { setIndex, index: selectedIndex } = navRoot;
  return (
    <li class="relative">
      <a
        class="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-ellipsis whitespace-nowrap rounded"
        classList={{
          "pointer-events-none bg-secondary text-secondary-text font-bold text-lg":
            index == selectedIndex(),
          "hover:bg-primary-light hover:font-bold hover:text-primary-text":
            index != selectedIndex(),
        }}
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

const Nav: Component = () => {
  const { list } = navRoot;
  const [display, setDisplay] = createSignal(false);
  return (
    <Show
      when={display()}
      fallback={
        <IoMenuOutline
          class="w-6 h-6"
          onclick={() => setDisplay(true)}
        ></IoMenuOutline>
      }
    >
      <div
        onclick={() => setDisplay(false)}
        class="absolute top-0 left-0 h-screen w-screen z-10 bg-black bg-opacity-80"
      >
        <div class="h-full w-min p-2 bg-primary pointer-events-none bg-opacity-100">
          <ul class="relative">
            <div class="flex text-center items-center text-3xl p-3 font-extrabold text-primary-text rounded">
              HoSub
            </div>
            <For each={list}>
              {(item, i) => (
                <NavItem
                  name={item.name}
                  component={item.component}
                  index={i()}
                ></NavItem>
              )}
            </For>
          </ul>
        </div>
      </div>
    </Show>
  );
};

const Breadcrumb: Component = () => {
  const { routes, current, Pop, Jump } = useRoute();

  return (
    <div class="p-2 h-full flex items-center">
      <nav class="text-sm w-full h-full">
        <ol class="list-reset flex h-full text-secondary-light">
          <li class="h-full mx-2 px-4 flex items-center">
            <Nav></Nav>
          </li>
          <li class="mx-2 px-4 flex items-center">
            <IoChevronBackOutline
              class="w-6 h-6"
              onclick={() => Pop()}
              classList={{
                " invisible pointer-events-none": routes().length == 1,
              }}
            ></IoChevronBackOutline>
          </li>
          <For each={routes()}>
            {({ name }, i) => (
              <>
                <li
                  class="h-full mx-2 px-4 flex items-center text-gray-300"
                  classList={{
                    "text-lg font-bold rounded !text-primary-text pointer-events-none":
                      current().name == name,
                  }}
                  onclick={() => Jump(i())}
                >
                  {name}
                </li>
                <li class="text-primary-light mx-2 px-4 flex items-center">
                  <Show when={i() < routes().length - 1}>
                    <IoCaretForwardOutline class="w-6 h-6"></IoCaretForwardOutline>
                  </Show>
                </li>
              </>
            )}
          </For>
        </ol>
      </nav>
    </div>
  );
};

const Main: Component = () => {
  const { setIndex } = navRoot;
  onMount(() => setIndex(0));

  const { current, Pop } = useRoute();
  createEffect(() => {
    document.title = current().name;
  });

  const keyHandler = (k: KeyboardEvent) => {
    switch (k.key) {
      case "Backspace":
        Pop();
        break;
    }
  };

  onMount(() => {
    window.addEventListener("keydown", keyHandler);
  });

  return (
    <div id="ho-main" class="w-full h-full grid bg-primary">
      <div id="ho-breadcrumb">
        <Breadcrumb></Breadcrumb>
      </div>
      <div id="ho-content" class="h-full w-full bg-gray-100 rounded">
        {renderRoute(current())}
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
