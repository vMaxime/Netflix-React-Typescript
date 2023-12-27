import { createContext, Dispatch, ReactElement, useReducer } from 'react';

interface ProfileInterface {
  name: string,
  coverUrl: string
}

interface UserInterface {
  token: string | null,
  email: string | null,
  profiles: ProfileInterface[]
}

const initialState: UserInterface = JSON.parse(localStorage.getItem("user") || '{"token": null, "email": null}');

type UserAction =
  | { type: "LOGIN"; payload: UserInterface }
  | { type: "LOGOUT" };
  
const reducer = (state: UserInterface, action: UserAction): UserInterface => {
    switch (action.type) {
      case "LOGIN": {
        localStorage.setItem('user', JSON.stringify(action.payload))
        return {
          ...state,
          ...action.payload
        };
      }
      case "LOGOUT": {
        localStorage.clear();
        return initialState;
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