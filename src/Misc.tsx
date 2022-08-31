import { IoCheckmarkOutline } from "solid-icons/io";
import {
  Accessor,
  Component,
  createContext,
  createSignal,
  Show,
  useContext,
} from "solid-js";

export const createFocusContext = () => {
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

export const FocusContext = createContext(createFocusContext());
export const useFocus = () => useContext(FocusContext);

export const createIdPool = (init?: number) => {
  const [id, setId] = createSignal(init ?? 0);

  const clean = () => setId(0);
  const getId = () => {
    const i = id();
    setId(i + 1);
    return i;
  };
  return {
    clean,
    getId,
    size() {
      return id();
    },
  } as const;
};

export const createFocusedId = (
  size: Accessor<number>,
  options?: { init?: number; onSet?: () => void }
) => {
  const option = options ?? {};
  const setCallback = option.onSet ?? (() => {});
  const [get, set] = createSignal(option.init ?? 0);
  const [needScroll, setScroll] = createSignal(false);

  const next = (needScroll?: boolean) => {
    if (get() >= size() - 1) {
      return;
    }
    setCallback();
    setScroll(needScroll ?? true);
    set((focused) => focused + 1);
  };
  const prev = (needScroll?: boolean) => {
    if (get() == 0) {
      return;
    }
    setCallback();
    setScroll(needScroll ?? true);
    set((focused) => focused - 1);
  };

  return {
    get,
    needScroll,
    set(id: number, needScroll?: boolean) {
      setCallback();
      setScroll(needScroll ?? false);
      set(id);
    },
    next,
    prev,
  };
};

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
