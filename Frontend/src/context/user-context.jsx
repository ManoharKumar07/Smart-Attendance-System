import { createContext } from "react";

export const usercontext = createContext({
  user: {
    name: "",
    email: "",
  },
  setUser: () => {},
});
