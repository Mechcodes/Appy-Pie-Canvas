import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  image: null,
  scale: 1,
  position: { x: 0, y: 0 },
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
    },
    setScale: (state, action) => {
      state.scale = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    resetEditor: () => initialState,
  },
});

export const { setImage, setScale, setPosition, resetEditor } = editorSlice.actions;

const store = configureStore({
  reducer: {
    editor: editorSlice.reducer,
  },
});

export default store;
