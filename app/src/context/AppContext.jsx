import { createContext, useContext, useReducer, useEffect } from 'react';
import * as storage from '../services/storage';

const AppContext = createContext(null);
const AppDispatchContext = createContext(null);

const initialState = {
  albums: [],
  weddingProfile: null,
  loading: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'LOADED':
      return { ...state, albums: action.albums, weddingProfile: action.profile, loading: false };
    case 'ADD_ALBUM':
      return { ...state, albums: [action.album, ...state.albums] };
    case 'UPDATE_ALBUM':
      return {
        ...state,
        albums: state.albums.map((a) => (a.id === action.album.id ? action.album : a)),
      };
    case 'DELETE_ALBUM':
      return { ...state, albums: state.albums.filter((a) => a.id !== action.id) };
    case 'SET_PROFILE':
      return { ...state, weddingProfile: action.profile };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function load() {
      const [albums, profile] = await Promise.all([
        storage.getAlbums(),
        storage.getWeddingProfile(),
      ]);
      dispatch({ type: 'LOADED', albums, profile });
    }
    load();
  }, []);

  return (
    <AppContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}

export function useAppDispatch() {
  return useContext(AppDispatchContext);
}
