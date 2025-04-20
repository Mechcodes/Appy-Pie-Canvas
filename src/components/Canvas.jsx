import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useSelector, useDispatch } from 'react-redux';
import { setScale, setPosition } from '../store/index.js';

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const imageRef = useRef(null);
  const clipPathRef = useRef(null);
  const dispatch = useDispatch();
  const { image} = useSelector((state) => state.editor);

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 300,
    });

    const clipPath = new fabric.Rect({
      width: 400,
      height: 300,
      rx: 20,
      ry: 20,
      absolutePositioned: true,
    });

    clipPathRef.current = clipPath;

    const stencilBorder = new fabric.Rect({
      width: 400,
      height: 300,
      rx: 20,
      ry: 20,
      fill: 'transparent',
      stroke: 'black',
      strokeWidth: 2,
      selectable: false,
      evented: false,
    });

    fabricRef.current.add(stencilBorder);
    fabricRef.current.centerObject(stencilBorder);

    return () => {
      fabricRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (image && fabricRef.current) {
      fabric.Image.fromURL(image, (img) => {
        const canvas = fabricRef.current;
        const clipPath = clipPathRef.current;

        // Calculate the scale to fit the image within the clipPath
        const scaleX = clipPath.width / img.width;
        const scaleY = clipPath.height / img.height;
        const initialScale = Math.min(scaleX, scaleY);

        img.set({
          scaleX: initialScale,
          scaleY: initialScale,
          clipPath: clipPath,
        });

        if (imageRef.current) {
          canvas.remove(imageRef.current);
        }

        imageRef.current = img;
        canvas.add(img);
        canvas.centerObject(img);

        // Ensure the image is behind the stencil border
        img.moveTo(0);

        canvas.renderAll();

        // Update Redux state
        dispatch(setScale(initialScale));
        dispatch(setPosition({ x: img.left, y: img.top }));
      });
    }
  }, [image, dispatch]);

  useEffect(() => {
    if (fabricRef.current && imageRef.current) {
      const canvas = fabricRef.current;
      const img = imageRef.current;
      const clipPath = clipPathRef.current;

      canvas.on('object:moving', (e) => {
        const imgBounds = img.getBoundingRect();
        const clipBounds = clipPath.getBoundingRect();

        // Constrain movement within clipPath bounds
        if (imgBounds.left > clipBounds.left) img.left = clipBounds.left;
        if (imgBounds.top > clipBounds.top) img.top = clipBounds.top;
        if (imgBounds.right < clipBounds.right) img.left = clipBounds.right - imgBounds.width;
        if (imgBounds.bottom < clipBounds.bottom) img.top = clipBounds.bottom - imgBounds.height;

        dispatch(setPosition({ x: img.left, y: img.top }));
        canvas.renderAll();
      });

      canvas.on('mouse:wheel', (e) => {
        e.e.preventDefault();
        e.e.stopPropagation();
        const delta = e.e.deltaY;
        let zoom = img.scaleX;
        zoom *= 0.999 ** delta;
        if (zoom > 0.1 && zoom < 5) {
          const center = img.getCenterPoint();
          img.scale(zoom);
          dispatch(setScale(zoom));

          // Adjust position to keep the image within the clipPath
          const imgBounds = img.getBoundingRect();
          const clipBounds = clipPath.getBoundingRect();

          if (imgBounds.width < clipBounds.width) {
            img.left = clipBounds.left + (clipBounds.width - imgBounds.width) / 2;
          }
          if (imgBounds.height < clipBounds.height) {
            img.top = clipBounds.top + (clipBounds.height - imgBounds.height) / 2;
          }

          img.setPositionByOrigin(center, 'center', 'center');
          dispatch(setPosition({ x: img.left, y: img.top }));
          canvas.renderAll();
        }
      });
    }
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center bg-gray-200 p-4 rounded-lg">
      <canvas ref={canvasRef} className="border border-gray-300 rounded" />
    </div>
  );
};

export default Canvas;
