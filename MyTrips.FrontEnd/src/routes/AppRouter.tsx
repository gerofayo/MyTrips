import { useRoutes } from "react-router-dom";
import { routes } from "./index";

export const AppRouter = () => {
  const element = useRoutes(routes);
  return element;
};