import {
  Component,
  createContext,
  createEffect,
  createMemo,
  createRoot,
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

export const renderRoute = (r: Route) => (
  <Dynamic component={r.component} {...(r.props ?? {})}></Dynamic>
);

const DefaultComponent: Component = () => {
  return <></>;
};

const createRouteContext = () => {
  const [routes, updateRoutes] = createSignal<Route[]>(
    [{ name: "", component: DefaultComponent }],
    { equals: false }
  );
  const [current, setCurrent] = createSignal(routes()[0]);

  const Push = (r: Route) => {
    updateRoutes((p) => {
      p.push(r);
      setCurrent(r);
      return p;
    });
  };
  const Pop = () => {
    updateRoutes((p) => {
      if (p.length > 1) {
        p.pop();
      }
      setCurrent(p[-1]);
      return p;
    });
    setCurrent(routes().at(-1));
  };
  const SetRoot = (r: Route) => {
    updateRoutes((p) => {
      setCurrent(r);
      return [r];
    });
  };

  return { routes, current, SetRoot, Push, Pop } as const;
};

const RouteContext = createContext(createRouteContext());

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
