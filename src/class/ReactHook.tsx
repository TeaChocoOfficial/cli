//-Path: "cli/src/class/ReactHook.tsx"
import { useEffect, DependencyList, useState } from "react";

export class ReactHook {
    static EventListener<K extends keyof DocumentEventMap>(
        type: K,
        listener: (this: Document, event: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions,
        deps: DependencyList = [],
    ) {
        useEffect(() => {
            document.addEventListener(type, listener, options);
            return () => document.removeEventListener(type, listener, options);
        }, deps);
    }
    static MousePositionTracker(deps: DependencyList = []) {
        const [mousePosition, setMousePosition] = useState<
            { x?: number; y?: number } | undefined
        >();

        useEffect(() => {
            const updateMousePosition = (event: MouseEvent) =>
                setMousePosition({ x: event.clientX, y: event.clientY });

            window.addEventListener("mousemove", updateMousePosition);
            return () =>
                window.removeEventListener("mousemove", updateMousePosition);
        }, deps);

        return mousePosition;
    }
    useProEffect(
        effect: () => Promise<void>,
        deps: React.DependencyList = [],
        callback: () => void = () => {},
    ) {
        useEffect(() => {
            effect();
            return callback();
        }, deps);
    }
}
