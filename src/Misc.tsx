import { IoCheckmarkOutline } from "solid-icons/io";
import {
  Component,
  createContext,
  createSignal,
  ParentComponent,
  Show,
  useContext,
} from "solid-js";

export const FocusContextConstructor = () => {
  const [focus, updateFocus] = createSignal({
    value: false,
    preventScroll: false,
  });

  const setFocus = (value: boolean, preventScroll?: boolean) => {
    updateFocus({ value, preventScroll: preventScroll ?? false });
  };

  const isFocused = () => focus().value;
  const isScrolled = () => !focus().preventScroll;

  return { isFocused, isScrolled, setFocus } as const;
};
export const FocusContext = createContext(FocusContextConstructor());
export const useFocus = () => useContext(FocusContext);

export const Checker: Component<{ value: boolean }> = (props) => {
  return (
    <Show when={props.value}>
      <IoCheckmarkOutline class="text-center"></IoCheckmarkOutline>
    </Show>
  );
};

export const Linker: Component<{ url: string }> = (props) => {
  const { isFocused } = useFocus();
  return (
    <a
      href={props.url}
      class="underline text-secondary-dark"
      classList={{
        "!text-inherit !font-inherit": isFocused(),
      }}
      target="_blank"
    >
      {props.url}
    </a>
  );
};
