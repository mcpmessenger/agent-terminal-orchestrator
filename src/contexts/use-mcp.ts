import { useContext } from "react";
import { McpContext } from "./McpContext";

export const useMcp = () => {
  const ctx = useContext(McpContext);
  if (!ctx) throw new Error("useMcp must be used within McpProvider");
  return ctx;
};