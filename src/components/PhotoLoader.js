import React, { useReducer } from 'react';
import shortid from 'shortid';
import { fileToDataUrl } from '../utils';

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'add': {
      return [...state, ...payload.items];
    }
    case 'remove': {
      const index = state.findIndex(({ id }) => id === payload.id);
      if (index === -1) {
        return state;
      }
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    default:
      console.warn('Unknown action', action);
      return state;
  }
};

const PhotoLoader = () => {
  const [items, dispatch] = useReducer(reducer, []);

  const handleSelect = async (evt) => {
    const files = [...evt.target.files];
    const urls = await Promise.all(files.map((o) => fileToDataUrl(o)));
    // У вас в массиве - dataUrl, можете использовать в качестве значения атрибута src тега img
    const newItems = files.map((file, index) => ({
      file,
      url: urls[index],
      id: shortid(),
    }));
    dispatch({ type: 'add', payload: { items: newItems } });
  };

  const handleRemove = (id) => {
    dispatch({ type: 'remove', payload: { id } });
  };

  const photos = items.map(({ url, id }) => (
    <div key={id} className="loader__preview">
      <img className="loader__img" src={url} alt="" />
      <div className="loader__remove-button" onClick={() => handleRemove(id)} />
    </div>
  ));

  return (
    <div className="loader">
      <label className="loader__file-label">
        <span className="loader__title">Click to select</span>
        <input
          className="loader__file-input"
          type="file"
          accept="image/*"
          onChange={handleSelect}
          multiple
        />
      </label>
      <div className="loader__previews">{photos}</div>
    </div>
  );
};

export default PhotoLoader;
