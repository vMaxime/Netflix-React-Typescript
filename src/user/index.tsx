import { createContext, Dispatch, ReactElement, useReducer } from 'react';

export interface NotificationInterface {
  title: string,
  subtitle: string,
  picture: string,
  date: Date
}

export interface ProfileInterface {
  id: string,
  name: string,
  picture: string,
  alias: string | null,
  read_next_episode: boolean,
  read_preview: boolean,
  notifications: NotificationInterface[]
}

export const findProfile = (user: UserInterface, id: string): ProfileInterface | null => {
  return user.profiles.find(profile => profile.id === id) || null;
};

export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const defaultProfiles: ProfileInterface[] = [
  {
    id: generateId(),
    name: 'Maxime',
    picture: 'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU6KWsiHSHvkft8VhZg0yyD50a_pHXku4dz9VgxWwfA2ontwogStpj1NE9NJMt7sCpSKFEY2zmgqqQfcw1FMWwB9.png?r=229',
    alias: null,
    read_next_episode: true,
    read_preview: true,
    notifications: []
  },
  {
    id: generateId(),
    name: 'Invité',
    picture: 'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABYo85Lg8Qn22cahF2sIw7K_gDo3cGpvw3Gt5xl7FIazw864EYeVkm71Qvrlz0HP2fU4n26AVq15v5t8T4lVBpBcqqZbmRHHsMefk.png?r=1d4',
    alias: null,
    read_next_episode: true,
    read_preview: true,
    notifications: []
  }
];

interface UserInterface {
  token: string | null,
  email: string | null,
  profiles: ProfileInterface[],
  selectedProfile: string | null,
  managingProfiles: boolean
}

const nullUser = {
  token: null,
  email: null,
  profiles: []
};

const initialState: UserInterface = JSON.parse(localStorage.getItem("user") || JSON.stringify(nullUser));
initialState.managingProfiles = false;
if (initialState.token != null) {
  const selectedProfileId = JSON.parse(sessionStorage.getItem('selected_profile') || 'null');
  initialState.selectedProfile = selectedProfileId;
}

type UserAction =
  | { type: "LOGIN", payload: UserInterface }
  | { type: "LOGOUT" }
  | { type: "TOGGLE_MANAGING" }
  | { type: "ADD_PROFILE", payload: ProfileInterface }
  | { type: "UPDATE_PROFILE", payload: ProfileInterface }
  | { type: "UPDATE_PROFILE_PICTURE", target: ProfileInterface, payload: string }
  | { type: "REMOVE_PROFILE", payload: string }
  | { type: "SELECT_PROFILE", payload: string | null };
  
const reducer = (state: UserInterface, action: UserAction): UserInterface => {
    switch (action.type) {
      case "LOGIN": {
        const user = {
          ...state,
          ...action.payload,
          profiles: defaultProfiles,
          selectedProfile: null
        };
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      case "LOGOUT": {
        localStorage.removeItem('user');
        sessionStorage.removeItem('selected_profile');
        return initialState;
      }
      case "TOGGLE_MANAGING": {
        return {
          ...state,
          managingProfiles: !state.managingProfiles
        }
      }
      case "ADD_PROFILE": {
        const user = {
          ...state,
          profiles: [...state.profiles, action.payload]
        }
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      case "UPDATE_PROFILE": {
        const user = {
          ...state,
          profiles: [...state.profiles.map(profile => profile.id === action.payload.id ? action.payload : profile)]
        }
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      case "UPDATE_PROFILE_PICTURE": {
        const user = {
          ...state,
          profiles: [...state.profiles.map(profile => profile.id === action.target.id ? { ...profile, picture: action.payload } : profile)]
        }
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      case "REMOVE_PROFILE": {
        const user = {
          ...state,
          profiles: state.profiles.filter(profile => profile.id != action.payload)
        }
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      case "SELECT_PROFILE": {
        const user = {
          ...state,
          selectedProfile: action.payload
        }
        sessionStorage.setItem('selected_profile', JSON.stringify(action.payload));
        return user;
      }
      default:
        return state;
    }
};

export const UserContext = createContext<UserInterface | null>(null);
export const UserDispatchContext = createContext<Dispatch<UserAction> | null>(null);


export const UserProvider = ({ children }: { children: ReactElement }) => {

  const [data, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <UserContext.Provider value={data}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}