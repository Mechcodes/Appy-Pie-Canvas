import React from 'react';
import { useDispatch } from 'react-redux';
import { setImage } from '../store';

const Controls = () => {
  const dispatch = useDispatch();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        dispatch(setImage(event.target.result));
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="flex flex-col space-y-4">
      <label className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600">
        <span className="mt-2 text-base leading-normal">Select an image</span>
        <input type='file' className="hidden" accept="image/*" onChange={handleImageUpload} />
      </label>
      
    </div>
  );
};

export default Controls;
