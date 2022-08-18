import {
  Component,
  createContext,
  createMemo,
  createSignal,
  JSX,
  useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";

type Route = {
  name: string;
  component: Component;
  props?: any;
};

const DefaultComponent: Component = () => {
  return <>asd</>;
};

const createRouteContext = () => {
  const [routes, updateRoutes] = createSignal<Route[]>(
    [{ name: "", component: DefaultComponent }],
    { equals: false }
  );
  const name = createMemo(() => routes().at(-1).name);
  const component = createMemo(() => (
    <Dynamic
      component={routes().at(-1).component}
      {...(routes().at(-1).props ?? {})}
    ></Dynamic>
  ));
  const Push = (r: Route) => {
    updateRoutes((p) => {
      p.push(r);
      return p;
    });
  };
  const Pop = () => {
    updateRoutes((p) => {
      if (p.length > 1) {
        p.pop();
      }
      return p;
    });
  };
  const SetRoot = (r: Route) => {
    updateRoutes((p) => {
      return [p[0], r];
    });
  };

  return { routes, name, component, SetRoot, Push, Pop } as const;
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
