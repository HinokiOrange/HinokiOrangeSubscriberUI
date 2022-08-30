import {
  Component,
  createContext,
  createSignal,
  ParentComponent,
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
  const Jump = (i: number) => {
    updateRoutes((p) => {
      return p.slice(0, i + 1);
    });
    setCurrent(routes().at(-1));
  };

  return { routes, current, SetRoot, Push, Pop, Jump } as const;
};

const RouteContext = createContext(createRouteContext());

export const RouteProvider: ParentComponent = (props) => {
  return (
    <RouteContext.Provider value={useRoute()}>
      {props.children}
    </RouteContext.Provider>
  );
};

export function useRoute() {
  return useContext(RouteContext);
}
