import { useContext, createContext } from "react";

export const WalletAlertContext = createContext({
  open: false,
  setOpen: (open) => {},
});

const useWalletAlertContext = () => {
  const context = useContext(WalletAlertContext);
  return context;
};

export default useWalletAlertContext;
