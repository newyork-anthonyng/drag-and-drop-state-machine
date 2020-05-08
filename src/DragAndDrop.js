import React, { useEffect } from "react";
import { Machine, assign } from "xstate";
import { useMachine } from "@xstate/react";

const dragMachine = Machine(
  {
    id: "dragAndDrop",
    initial: "idle",
    context: {
      // represent the x and y value of container
      x: 0,
      y: 0,

      // represent the x and y value of mouse click
      pointerX: 0,
      pointerY: 0,

      // represent the change in x and y value of mouse click
      dx: 0,
      dy: 0,
    },
    states: {
      idle: {
        on: {
          START_DRAG: {
            actions: "setOriginalCoordinates",
            target: "dragging",
          },
        },
      },
      dragging: {
        on: {
          MOVE: {
            actions: "updateCoordinates",
          },
          END_DRAG: {
            actions: "setEndCoordinates",
            target: "idle",
          },
        },
      },
    },
  },
  {
    actions: {
      setOriginalCoordinates: assign({
        pointerX: (_, event) => event.x,
        pointerY: (_, event) => event.y,
      }),
      updateCoordinates: assign({
        dx: (context, event) => {
          return event.x - context.pointerX;
        },
        dy: (context, event) => {
          return event.y - context.pointerY;
        },
      }),
      setEndCoordinates: assign({
        x: (context) => context.x + context.dx,
        y: (context) => context.y + context.dy,
        dx: 0,
        dy: 0,
      }),
    },
  }
);

function DragAndDrop() {
  const [state, send] = useMachine(dragMachine);
  const { x, y, dx, dy } = state.context;

  const handleMouseDown = (e) => {
    send({ type: "START_DRAG", x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    send({ type: "MOVE", x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    send({ type: "END_DRAG", x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div
      onMouseDown={handleMouseDown}
      className="bg-blue-500 w-32 h-32 text-white absolute flex items-center justify-center select-none"
      style={{ left: `${x + dx}px`, top: `${y + dy}px` }}
    >
      {state.matches("idle") ? "idle" : "dragging"}
    </div>
  );
}

export default DragAndDrop;
