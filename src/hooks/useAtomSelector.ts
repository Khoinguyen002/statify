import { useEffect, useState } from "react";
import { STATE_CHANGE_EVENT } from "../state-management/atom.constants";
import {
  AtomState,
  NestedKeyOf,
  PathValue,
  PublicAtom,
} from "../state-management/atom.type";
import { toAtom } from "../state-management/createAtom";
import { event } from "../state-management/atom.events";

type ReturnValue<A extends AtomState, P extends NestedKeyOf<A>> = PathValue<
  A,
  P
>;

const useAtomSelector = <
  A extends AtomState,
  K extends string,
  P extends NestedKeyOf<A>
>({
  atom,
  props,
}: {
  atom: PublicAtom<K, A>;
  props: P;
}): ReturnValue<A, P> => {
  const [selectedState, setSelectedState] = useState<ReturnValue<A, P>>(
    atom.get(props)
  );

  useEffect(() => {
    if (!props) return;
    const eventName = STATE_CHANGE_EVENT + "_" + atom.getKey() + "_" + props;
    const handleOnEventEmitter = () => {
      setSelectedState(atom.getCloneDeep(props));
    };
    event.addEventListener(eventName, handleOnEventEmitter);
    toAtom(atom).addWatchingPaths(props);
    return () => {
      event.removeEventListener(eventName, handleOnEventEmitter);
    };
  }, [props]);

  // Keep state up-to-date when props's changed
  useEffect(() => {
    setSelectedState(atom.get(props));
  }, [props]);

  return selectedState;
};

export default useAtomSelector;
