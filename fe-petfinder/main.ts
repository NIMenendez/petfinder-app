import { initRouter } from "./router";

(function main() {
  let app: HTMLDivElement = document.querySelector("#app")!;
  if (!app) {
    throw new Error("Elemento #app no encontrado");
  }
  initRouter();
})();

