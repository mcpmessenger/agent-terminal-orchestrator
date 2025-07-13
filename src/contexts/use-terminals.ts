import { useContext } from "react";
import { TerminalContext } from "./TerminalContext";

export const useTerminals = () => {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminals must be used within TerminalProvider");
  return ctx;
};