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
      rx: 20,
      ry: 20,
      left,
      top,
      absolutePositioned: true,
    });
  
    const stencilBorder = new fabric.Rect({
      width,
      height,
      rx: 20,
      ry: 20,
      left,
      top,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
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
        left: stencilBorder.left,
        top: stencilBorder.top,
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
        const imageScaleX = newWidth / img.width;
        const imageScaleY = newHeight / img.height;
        const newImageScale = Math.min(imageScaleX, imageScaleY);
  
        img.set({
          scaleX: newImageScale,
          scaleY: newImageScale,
          left: clipPath.left,
          top: clipPath.top,
        });
        img.setCoords();
  
        dispatch(setScale(newImageScale));
        dispatch(setPosition({ x: img.left, y: img.top }));
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
