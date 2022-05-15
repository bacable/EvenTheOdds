import { WindowType } from "../enums/windowType";

export interface PopupWindowContainer {
  closeWindow(windowType:WindowType, selection: string): void;
}