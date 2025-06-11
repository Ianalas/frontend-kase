import { ReactNode } from "react";

export default interface ItemHeader {
  link: string;
  content: string;
  icon: ReactNode | string;
}