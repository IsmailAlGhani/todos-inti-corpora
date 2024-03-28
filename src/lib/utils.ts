import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum typeModalAction {
  UPDATE,
  DELETE,
}

export type DataUpdateProps = {
  id: string;
  type: typeModalAction;
};
