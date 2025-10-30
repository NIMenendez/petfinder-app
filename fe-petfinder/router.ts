import { initHomePets } from "./pages/home-pets";
import { initHome } from "./pages/home";
import { initProfile } from "./pages/profile/profile";
import { initEditProfile } from "./pages/profile/modify-profile";
import { initEditPassword } from "./pages/profile/modify-pw";
import { initMyReports } from "./pages/profile/my-reports";
import { initReportLostPet } from "./pages/profile/report-lost-pet";
import { initEditReport } from "./pages/profile/edit-report";
import { initSignup } from "./pages/profile/signup";
import { initLogin } from "./pages/profile/login";

type RouterPath = {
  pathRegex: RegExp;
  render: (params: { goTo: (path: string) => void }) => HTMLElement | Promise<HTMLElement>;
};

// Definición de rutas
const routes: RouterPath[] = [
  { pathRegex: /^\/home$/, render: () => initHome({ goTo }) },
  { pathRegex: /^\/home\/pets$/, render: () => initHomePets({ goTo }) },
  { pathRegex: /^\/profile$/, render: () => initProfile({ goTo }) },
  { pathRegex: /^\/edit-profile$/, render: () => initEditProfile({ goTo }) },
  { pathRegex: /^\/change-password$/, render: () => initEditPassword({ goTo }) },
  { pathRegex: /^\/my-reports$/, render: () => initMyReports({ goTo }) },
  { pathRegex: /^\/report-lost-pet$/, render: () => initReportLostPet({ goTo }) },
  { pathRegex: /^\/edit-report$/, render: () => initEditReport({ goTo }) },
  { pathRegex: /^\/signup$/, render: () => initSignup({ goTo }) },
  { pathRegex: /^\/login$/, render: () => initLogin({ goTo }) },
  { pathRegex: /.*/, render: () => {
      const notFound = document.createElement('div');
      notFound.innerHTML = '<h1>404 - Página no encontrada</h1>';
      return notFound;
    }
  }
];

// Función para navegar
function goTo(path: string) {
  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  history.pushState({}, "", normalizedPath);
  renderPath(normalizedPath);
}

// Función para renderizar según la ruta
async function renderPath(path: string): Promise<void> {
  // Quitar trailing slash
  const adjustedPath = path.replace(/\/$/, "") || "/";

  const route = routes.find(r => r.pathRegex.test(adjustedPath));

  if (route) {
    const app = document.getElementById("app");
    if (app) {
      app.innerHTML = "";
      const element = await route.render({ goTo });
      app.appendChild(element);
    }
  } else {
    console.warn(`El path '${adjustedPath}' no fue encontrado.`);
  }
}

// Inicializa router al cargar la página
function initRouter(): void {
  const pathname = location.pathname.replace(/\/$/, "") || "/";

  if (pathname === "" || pathname === "/") {
    goTo("/home");
  } else {
    renderPath(pathname);
  }

  // Escucha cambios del historial
  window.addEventListener("popstate", () => renderPath(location.pathname));
}

export { initRouter, goTo };