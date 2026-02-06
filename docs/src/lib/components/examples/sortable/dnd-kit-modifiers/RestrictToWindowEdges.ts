import type { DragDropManager } from "@dnd-kit/dom";
import { Modifier } from "@dnd-kit/abstract";
import { Rectangle } from "@dnd-kit/geometry";
import { getViewportBoundingRectangle } from "@dnd-kit/dom/utilities";
import { restrictShapeToBoundingRectangle } from "@dnd-kit/abstract/modifiers";

export class RestrictToWindowEdges extends Modifier<DragDropManager> {
  apply({ shape, transform, source }: DragDropManager["dragOperation"]) {
    if (!shape) return transform;

    const element = source?.element ?? document.documentElement;
    const bounds = getViewportBoundingRectangle(element);

    const { initial, current } = shape;
    const { height, width } = current.boundingRectangle;
    const left = initial.center.x - width / 2;
    const top = initial.center.y - height / 2;

    return restrictShapeToBoundingRectangle(
      new Rectangle(left, top, width, height),
      transform,
      bounds
    );
  }
}
