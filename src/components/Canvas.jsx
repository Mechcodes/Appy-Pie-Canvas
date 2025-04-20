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
    if (!selectedFrame) return;

    // If stencil already exists, skip recreating
    if (stencilRef.current) return;

    const width = 400;
    const height = 300;
    const left = 100;
    const top = 50;

    const clipPath = new fabric.Rect({
      width,
      height,
      left,
      top,
      absolutePositioned: true,
    });

    const stencilBorder = new fabric.Rect({
      width,
      height,
      left,
      top,
      fill: "transparent",
      stroke: "#B5651D",
      strokeWidth: 20,
      hasControls: true,
      hasBorders: true,
      lockScalingFlip: true,
      objectCaching: false,
    });

    clipPathRef.current = clipPath;
    stencilRef.current = stencilBorder;

    canvas.add(stencilBorder);
    canvas.setActiveObject(stencilBorder);
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

    stencilBorder.on("scaling", () => {
      const scaleX = stencilBorder.scaleX;
      const scaleY = stencilBorder.scaleY;

      const newWidth = stencilBorder.width * scaleX;
      const newHeight = stencilBorder.height * scaleY;

      // Update dimensions of clipPath and stencil
      clipPath.set({
        width: newWidth,
        height: newHeight,
        left: clipPath.left,
        top: clipPath.top,
      });
      clipPath.setCoords();

      stencilBorder.set({
        scaleX: 1,
        scaleY: 1,
        width: newWidth,
        height: newHeight,
      });
      stencilBorder.setCoords();

      // Resize image to fit stencil
      const img = imageRef.current;
      if (img) {
        const currentVisibleWidth = img.width * img.scaleX;
        const currentVisibleHeight = img.height * img.scaleY;

        const requiredWidth = currentVisibleWidth * scaleX;
        const requiredHeight = currentVisibleHeight * scaleY;

        const imageScaleX = requiredWidth / img.width;
        const imageScaleY = requiredHeight / img.height;

        const currentTop = img.top;
        const currentLeft = img.left;
        img.set({
          top: Math.abs(clipPath.top - currentTop) * scaleY + clipPath.top,
          left: Math.abs(clipPath.left - currentLeft) * scaleX + clipPath.left,
          scaleX: imageScaleX,
          scaleY: imageScaleY,
        });
        img.setCoords();

        //dispatch(setScale(newImageScale));
        //dispatch(setPosition({ x: img.left, y: img.top }));
      }

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
      const frameWidth = clipPath?.width;
      const frameHeight = clipPath?.height;
      const frameLeft = clipPath?.left || 0;
      const frameTop = clipPath?.top || 0;

      // Calculate scale to make the image slightly larger than the frame
      const scaleX = (frameWidth * 1.1) / img.width; // 10% larger
      const scaleY = (frameHeight * 1.1) / img.height; // 10% larger
      const initialScale = Math.min(scaleX, scaleY);

      const imgWidthScaled = img.width * initialScale;
      const imgHeightScaled = img.height * initialScale;

      // Center the image within the frame

      const centerLeft = frameLeft + (frameWidth - imgWidthScaled) / 2;
      const centerTop = frameTop + (frameHeight - imgHeightScaled) / 2;

      img.set({
        scaleX: initialScale,
        scaleY: initialScale,
        left: centerLeft,
        top: centerTop,
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
      // canvas.bringToFront(stencilRef.current);

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
