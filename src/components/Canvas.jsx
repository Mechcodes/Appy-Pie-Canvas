import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";
import { useSelector, useDispatch } from "react-redux";
import { setScale, setPosition } from "../store";

const Canvas = ({ selectedFrame }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const imageRef = useRef(null);
  const clipPathRef = useRef(null);
  const stencilRef = useRef(null);
  const dispatch = useDispatch();
  const { image } = useSelector((state) => state.editor);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const parent = canvasElement.parentElement;

    const canvasWidth = parent.clientWidth;
    const canvasHeight = parent.clientHeight;

    fabricRef.current = new fabric.Canvas(canvasElement, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: "#f0f0f0",
      preserveObjectStacking: true,
    });

    return () => {
      fabricRef.current.dispose();
    };
  }, []);

  const addStencil = () => {
    const canvas = fabricRef.current;
    if (!selectedFrame || stencilRef.current) return;

    let clipPath;
    let stencilBorder;

    switch (selectedFrame) {
      case "circle":
        clipPath = new fabric.Circle({
          radius: 150,
          left: 100,
          top: 0,
          absolutePositioned: true,
        });
        stencilBorder = new fabric.Circle({
          radius: 150,
          left: 100,
          top: 0,
          stroke: "black",
          fill: "transparent",
          strokeWidth: 2,
          selectable: false,
          evented: false,
        });
        break;
      case "star":
        clipPath = new fabric.Polygon(
          [
            { x: 200, y: 50 },
            { x: 240, y: 180 },
            { x: 100, y: 110 },
            { x: 300, y: 110 },
            { x: 160, y: 180 },
          ],
          {
            absolutePositioned: true,
          }
        );
        stencilBorder = fabric.util.object.clone(clipPath);
        stencilBorder.set({
          stroke: "black",
          fill: "transparent",
          strokeWidth: 2,
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });

        break;
      default:
        clipPath = new fabric.Rect({
          width: 400,
          height: 300,
          rx: 20,
          ry: 20,
          absolutePositioned: true,
        });
        stencilBorder = new fabric.Rect({
          width: 400,
          height: 300,
          rx: 20,
          ry: 20,
          fill: "transparent",
          stroke: "black",
          strokeWidth: 2,
        });
    }

    clipPathRef.current = clipPath;
    stencilRef.current = stencilBorder;

    canvas.add(stencilBorder);
    canvas.sendToBack(stencilBorder);
    canvas.renderAll();
    let prevLeft = stencilBorder.left;
  let prevTop = stencilBorder.top;

  stencilBorder.on("moving", () => {
    const deltaX = stencilBorder.left - prevLeft;
    const deltaY = stencilBorder.top - prevTop;

    if (imageRef.current) {
      imageRef.current.left += deltaX;
      imageRef.current.top += deltaY;
      imageRef.current.setCoords();
    }

    if (clipPathRef.current) {
      clipPathRef.current.left += deltaX;
      clipPathRef.current.top += deltaY;
      clipPathRef.current.setCoords();
    }

    prevLeft = stencilBorder.left;
    prevTop = stencilBorder.top;

    canvas.renderAll();
  });

  };

  useEffect(() => {
    if (selectedFrame) {
      const canvas = fabricRef.current;
      canvas.clear();
      stencilRef.current = null;
      imageRef.current = null;
      addStencil();
    }
  }, [selectedFrame]);

  useEffect(() => {
    const canvas = fabricRef.current;

    if (!image) {
      canvas.clear();
      stencilRef.current = null;
      imageRef.current = null;
      return;
    }

    fabric.Image.fromURL(image, (img) => {
      const clipPath = clipPathRef.current;
      
      const scaleX = (clipPath?.width || 400) / img.width;
      const scaleY = (clipPath?.height || 300) / img.height;
      const initialScale = Math.min(scaleX, scaleY);

      img.set({
        scaleX: initialScale,
        scaleY: initialScale,
        left: 0,
        top: 0,
        selectable: true,
        hasBorders: true,
        hasControls: true,
      });
      if (clipPath) {
        img.clipPath = clipPath;
      }

      if (imageRef.current) {
        canvas.remove(imageRef.current);
      }

      imageRef.current = img;
      canvas.add(img);
     

      img.bringToFront();
      canvas.setActiveObject(img);
      canvas.renderAll();

      dispatch(setScale(initialScale));
      dispatch(setPosition({ x: img.left, y: img.top }));
    });
  }, [image, dispatch]);

  // You can keep object:moving and mouse:wheel handlers here as-is...

  return (
    <div className="flex-1 h-full bg-gray-200 p-4 rounded-lg">
      <canvas
        ref={canvasRef}
        className="w-full h-full border border-gray-300 rounded"
      />
    </div>
  );
};

export default Canvas;
