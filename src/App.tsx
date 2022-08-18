import { Component, For, onCleanup, onMount } from "solid-js";
import { RouteProvider, useRoute } from "./Route";

const MenuItem: Component<{ name: string; component: Component }> = ({
  name,
  component,
}) => {
  const { SetRoot, name: route_name } = useRoute();
  return (
    <li class="relative">
      <a
        class="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
        classList={{ "bg-black": name == route_name() }}
        data-mdb-ripple="true"
        data-mdb-ripple-color="dark"
        onClick={(e) => {
          e.preventDefault();
          SetRoot({ name, component, props: { num: 100 } });
        }}
      >
        {name}
      </a>
    </li>
  );
};

const Test: Component<{ num?: number }> = ({ num }) => {
  num ??= 1;
  let inter = setInterval(() => {
    console.log(num);
  }, 1000);
  onMount(() => {
    console.log("mount");
  });
  onCleanup(() => {
    clearInterval(inter);
    console.log("cleanup");
  });
  return <>TEst {num}</>;
};

const MenuBar: Component = () => {
  return (
    <div class="h-screen shadow-md bg-white px-1">
      <ul class="relative">
        <MenuItem name="Novel" component={Test}></MenuItem>
      </ul>
    </div>
  );
};

const Main: Component = () => {
  const { routes, component, name } = useRoute();
  return (
    <div class="flex flex-row flex-grow">
      <MenuBar></MenuBar>
      {name()}
      {component()}

      <div>
        <For each={routes()}>{({ name }) => <div>{name}</div>}</For>
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
