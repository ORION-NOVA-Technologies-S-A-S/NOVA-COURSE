import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import { Layout } from "./components/Layout";
import { Admin } from "./pages/Admin";
import { ForgotPasswordPage, LoginPage, NewPasswordPage, RegisterPage } from "./pages/AuthPages";
import { Catalog } from "./pages/Catalog";
import { ClassPage } from "./pages/ClassPage";
import { CoursePage } from "./pages/CoursePage";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { LessonPage } from "./pages/LessonPage";
import { PaymentResult } from "./pages/PaymentResult";
import { Verify } from "./pages/Verify";
import "./styles.css";

// Regreso desde Wompi: ...?pago=REFERENCIA&id=TRANSACCION → página de resultado
{
  const search = window.location.search;
  const ref = /[?&]pago=([\w-]+)/.exec(search)?.[1];
  if (ref) {
    const tx = /[?&]id=([\w-]+)/.exec(search)?.[1];
    const target = `#/pago/resultado?ref=${ref}${tx ? `&id=${tx}` : ""}`;
    window.history.replaceState(null, "", window.location.origin + window.location.pathname + target);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cursos" element={<Catalog />} />
            <Route path="cursos/:slug" element={<CoursePage />} />
            <Route path="leccion/:id" element={<LessonPage />} />
            <Route path="clase" element={<ClassPage />} />
            <Route path="ingresar" element={<LoginPage />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route path="recuperar" element={<ForgotPasswordPage />} />
            <Route path="nueva-clave" element={<NewPasswordPage />} />
            <Route path="admin" element={<Admin />} />
            <Route path="mi-aprendizaje" element={<Dashboard />} />
            <Route path="pago/resultado" element={<PaymentResult />} />
            <Route path="verificar" element={<Verify />} />
            <Route path="verificar/:code" element={<Verify />} />
            <Route path="*" element={<section className="wrap section"><h1>Página no encontrada</h1></section>} />
          </Route>
        </Routes>
      </HashRouter>
    </AuthProvider>
  </StrictMode>,
);
