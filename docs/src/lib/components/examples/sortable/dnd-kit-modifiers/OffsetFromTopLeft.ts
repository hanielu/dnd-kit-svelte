// packages/dom/src/modifiers/OffsetFromTopLeft.ts
import { Modifier, configurator } from "@dnd-kit/abstract";
import type { DragDropManager } from "@dnd-kit/dom";
import { getFrameTransform } from "@dnd-kit/dom/utilities";

type Offset = number | { x: number; y: number };

export class OffsetFromTopLeft extends Modifier<DragDropManager, { offset?: Offset }> {
  private normalizedOffset: { x: number; y: number } | undefined;

  apply(operation: DragDropManager["dragOperation"]) {
    const { transform, status, source } = operation;

    // @ts-expect-error Status snapshot exposes `.value`
    if (status.value === "idle") {
      this.normalizedOffset = undefined;
      return transform;
    }

    if (!this.normalizedOffset) {
      const { offset = 0 } = this.options ?? {};
      const dx = typeof offset === "number" ? offset : offset.x;
      const dy = typeof offset === "number" ? offset : offset.y;

      if (source?.element) {
        const frame = getFrameTransform(source.element);
        const sx = frame.scaleX || 1;
        const sy = frame.scaleY || 1;

        // Convert CSS pixel intent into transform-space (Feedback multiplies by scale later)
        this.normalizedOffset = { x: dx / sx, y: dy / sy };
      } else {
        this.normalizedOffset = { x: dx, y: dy };
      }
    }

    return {
      x: transform.x + this.normalizedOffset.x,
      y: transform.y + this.normalizedOffset.y,
    };
  }

  static configure = configurator(OffsetFromTopLeft);
}
