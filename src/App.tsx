import {
  Component,
  createEffect,
  createRoot,
  createSignal,
  For,
  onMount,
} from "solid-js";
import { NovelList } from "./Novel";
import { renderRoute, RouteProvider, useRoute } from "./Route";
import { Test } from "./Test";

const navRoot = createRoot(() => {
  const list = [
    // { name: "Test", component: Test },
    { name: "Novel", component: NovelList },
  ];

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
        class="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-ellipsis whitespace-nowrap rounded "
        classList={{
          "bg-white text-orange-700 pointer-events-none":
            index == selectedIndex(),
          "hover:bg-orange-300 hover:font-bold hover:text-black":
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
  return (
    <div class="h-full sticky top-0 left-0 bg-third text-white p-2">
      <ul class="relative">
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
  );
};

const Breadcrumb: Component = () => {
  const { routes, current } = useRoute();

  return (
    <div class="p-2 h-full flex items-center">
      <nav class=" text-gray-700 text-sm  w-full h-full">
        <ol class="list-reset flex py-2 h-full">
          <For each={routes()}>
            {({ name }, i) => (
              <>
                <li
                  class="h-full px-6 flex items-center"
                  classList={{
                    "bg-primary text-third text-xl font-bold rounded":
                      current().name == name,
                  }}
                >
                  {name}
                </li>
                <span class="text-gray-500 mx-2 py-4 px-6">
                  {i() < routes().length - 1 ? "/" : ""}
                </span>
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

  const { current } = useRoute();
  createEffect(() => {
    document.title = current().name;
  });
  return (
    <div id="ho-main" class="w-full h-full grid bg-third">
      <div id="ho-logo" class="p-2">
        <div class="flex text-center items-center text-3xl p-3 bg-second font-extrabold text-third rounded">
          HoSub
        </div>
      </div>
      <div id="ho-nav" class="h-full">
        <Nav></Nav>
      </div>
      <div id="ho-breadcrumb">
        <Breadcrumb></Breadcrumb>
      </div>
      <div id="ho-content" class="h-full w-full">
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
