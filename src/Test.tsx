import {
  Component,
  createContext,
  createSignal,
  For,
  JSX,
  JSXElement,
  useContext,
} from "solid-js";

const TestContext = createContext<number>(100);

const Test2: Component = () => {
  const num = useContext(TestContext);
  return <div>{num}</div>;
};

const TestL1: Component<{ num: number; children?: JSXElement }> = ({
  num,
  children,
}) => {
  return (
    <div>
      <TestContext.Provider value={num}>{children}</TestContext.Provider>
    </div>
  );
};

const TestRoot: Component<{ children?: JSX.Element }> = ({ children }) => {
  return <>{children}</>;
};

export const Test: Component = () => {
  return (
    <TestRoot>
      <For each={Array(100)}>
        {(_, i) => (
          <TestContext.Provider value={i()}>
            {/* <TestL1 num={i()}> */}
            <Test2></Test2>
            {/* </TestL1> */}
          </TestContext.Provider>
        )}
      </For>
    </TestRoot>
  );
};
