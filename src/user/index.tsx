import { createContext, Dispatch, ReactElement, useReducer } from 'react';

export interface ProfileInterface {
  name: string,
  picture: string,
  alias: string | null,
  read_next_episode: boolean,
  read_preview: boolean
}

const defaultProfiles: ProfileInterface[] = [
  {
    name: 'Maxime',
    picture: 'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABfjwXqIYd3kCEU6KWsiHSHvkft8VhZg0yyD50a_pHXku4dz9VgxWwfA2ontwogStpj1NE9NJMt7sCpSKFEY2zmgqqQfcw1FMWwB9.png?r=229',
    alias: null,
    read_next_episode: true,
    read_preview: true
  },
  {
    name: 'Invité',
    picture: 'https://occ-0-2216-55.1.nflxso.net/dnm/api/v6/vN7bi_My87NPKvsBoib006Llxzg/AAAABYo85Lg8Qn22cahF2sIw7K_gDo3cGpvw3Gt5xl7FIazw864EYeVkm71Qvrlz0HP2fU4n26AVq15v5t8T4lVBpBcqqZbmRHHsMefk.png?r=1d4',
    alias: null,
    read_next_episode: true,
    read_preview: true
  }
];

interface UserInterface {
  token: string | null,
  email: string | null,
  profiles: ProfileInterface[]
}

const nullUser = {
  token: null,
  email: null,
  profiles: []
};
const initialState: UserInterface = JSON.parse(localStorage.getItem("user") || JSON.stringify(nullUser));

type UserAction =
  | { type: "LOGIN", payload: UserInterface }
  | { type: "LOGOUT" }
  | { type: "ADD_PROFILE", payload: ProfileInterface }
  | { type: "UPDATE_PROFILE", target: string, payload: ProfileInterface };
  
const reducer = (state: UserInterface, action: UserAction): UserInterface => {
    switch (action.type) {
      case "LOGIN": {
        const user = {
          ...state,
          ...action.payload,
          profiles: defaultProfiles
        };
        localStorage.setItem('user', JSON.stringify(user))
        return user;
      }
      case "LOGOUT": {
        localStorage.clear();
        return initialState;
      }
      case "ADD_PROFILE": {
        const user = {
          ...state,
          profiles: [...state.profiles, action.payload]
        }
        localStorage.setItem('user', JSON.stringify(user))
        return user;
      }
      case "UPDATE_PROFILE": {
        const user = {
          ...state,
          profiles: [...state.profiles.map(profile => profile.name === action.target ? action.payload : profile)]
        }
        localStorage.setItem('user', JSON.stringify(user))
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