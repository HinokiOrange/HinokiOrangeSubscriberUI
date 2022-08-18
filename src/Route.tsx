import {
  Component,
  createContext,
  createSignal,
  JSX,
  JSXElement,
  useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";

type Route = {
  name: string;
  component: Component;
  props?: any;
};

const DefaultComponent: Component = () => {
  return <></>;
};

const createRouteContext = () => {
  let stack: Route[] = [];
  const [name, setName] = createSignal<string>(""),
    [component, setComponent] = createSignal(DefaultComponent),
    [props, setProps] = createSignal<any>();
  const Push = (r: Route) => {
    stack.push(r);
    setName(r.name);
    setProps(r.props);
    setComponent(() => r.component);
  };
  const Pop = () => {
    if (stack.length == 1) {
      return;
    }

    stack.pop();
    setName(stack.at(-1).name);
    setProps(stack.at(-1).props);
    setComponent(() => stack.at(-1).component);
  };
  const SetRoot = (r: Route) => {
    stack = [];
    Push(r);
  };
  const renderComponent = () => {
    return (
      <Dynamic component={component()} {...(props ? props() : {})}></Dynamic>
    );
  };

  return { name, SetRoot, Push, Pop, renderComponent } as const;
};
const RouteContext = createContext<ReturnType<typeof createRouteContext>>(
  createRouteContext()
);

export function RouteProvider({
  children,
}: {
  children: JSX.Element;
}): JSX.Element {
  return (
    <RouteContext.Provider value={useRoute()}>{children}</RouteContext.Provider>
  );
}

export function useRoute() {
  return useContext(RouteContext);
}
