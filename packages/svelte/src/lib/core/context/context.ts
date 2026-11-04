import type { DragDropManager } from "@dnd-kit/dom";
import { createContext } from "svelte";

/** The manager of the closest `DragDropProvider` (or the registration-proof proxy a `DragOverlay` provides). */
export const [getDragDropContext, setDragDropContext] = createContext<DragDropManager>();
