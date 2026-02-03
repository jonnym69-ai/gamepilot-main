// Fix for React Router JSX component typing in TS 5+
// Allows <Route /> to be treated as a valid JSX element
// Includes all missing exports to prevent breaking changes

declare module "react-router-dom" {
  import * as React from 'react';
  
  export interface RouteProps {
    element?: React.ReactNode
    path?: string
    index?: boolean
  }
  
  export function useNavigate(): (to: string) => void;
  export function useLocation(): any;
  export function useParams<T = any>(): T;
  export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void];
  
  export const Link: React.ComponentType<any>;
  export const Navigate: React.ComponentType<any>;
  export const Route: React.ComponentType<RouteProps>;
  export const Routes: React.ComponentType<any>;
  export const BrowserRouter: React.ComponentType<any>;
}
