import { ScrollbarPlugin } from "https://unpkg.com/smooth-scrollbar@8.8.1/scrollbar.js";

export class ModalPlugin extends ScrollbarPlugin {
  static pluginName = "modal";

  static defaultOptions = {
    open: false,
  };

  transformDelta(delta) {
    return this.options.open ? { x: 0, y: 0 } : delta;
  }
}