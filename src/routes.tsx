import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Entrar } from "@/pages/auth/Entrar";
import { Registro } from "./pages/auth/Registro";
import { Inicio } from "./pages/dashboard/Inicio/Inicio";
import DashboardLayout from "./layout/DashboardLayout";
import CadastroLayout from "./layout/AuthLayout";
import { Historico } from "./pages/dashboard/Historico/Historico";
import { Pedidos } from "./pages/dashboard/Pedidos/Pedidos";
import { ToastContainer } from "react-toastify";

import { useTheme } from "./components/themes/theme-provider";
import { AuthProvider } from "./contexts/Autetication";
import { PrivateRoute } from "./pages/PrivateRoute";
import { UnauthorizedPage } from "./pages/Unauthorized";
import { Perfil } from "./pages/dashboard/Perfil";

import { Dashboard } from "./pages/admin/dashboard/Dashboard";
import { RelacaoAlunos } from "./pages/admin/RelacaoAlunos/RelacaoAlunos";
import { HistoricoAulas } from "./pages/admin/HistoricoAulas/HistoricoAulas";
import { RelacaoFuncionario } from "./pages/admin/RelacaoFuncionario/RelacaoFuncionario";
import { Produtos } from "./pages/admin/Produtos/Produtos";

import { NotFound } from "./pages/NotFound";
//import { BuyProduct } from "./pages/dashboard/BuyProduct/BuyProduct";
import { ProductProvider } from "./contexts/ProductContext";
import { CheckoutPage } from "./pages/dashboard/CheckoutPage";
import { UserProvider } from "./contexts/UserContext";
import { ClassProvider } from "@/contexts/ClassContext";


export const Approutes = () => {
  const theme = useTheme().theme;
  return (
    <AuthProvider>
      <ProductProvider>
        <UserProvider>
          <ClassProvider>
            <Router>
              <Routes>
                {/* Rotas de Login/Registro */}
                <Route path="/auth" element={<CadastroLayout />}>
                  <Route path="entrar" element={<Entrar />} />
                  <Route path="registro" element={<Registro />} />
                </Route>

                {/* Rotas de Clientes */}
                <Route element={<PrivateRoute requiredRole={["aluno", "funcionario", "admin"]} />} path="/">
                  <Route element={<DashboardLayout />}>
                    <Route index element={<Inicio />} />
                    <Route path="historico" element={<Historico />} />
                    <Route path="pedidos" element={<Pedidos />} />
                    <Route path="perfil" element={<Perfil />} />
                    <Route path="buy-product" element={<CheckoutPage />} />
                </Route>
            
              
                  {/* Rotas de Login/Registro */}
                  <Route path="/auth" element={<CadastroLayout />}>
                    <Route index element={<Navigate to="/auth/entrar" replace />} />
                    <Route path="entrar" element={<Entrar />} />
                    <Route path="registro" element={<Registro />} />

                  </Route>
                </Route>

                {/* Rotas de Administradores */}
                <Route element={<PrivateRoute requiredRole={["admin", "funcionario"]} />} path="/admin">
                  <Route element={<DashboardLayout />}>
                    <Route index element={<Dashboard/>} />
                    <Route path="relacao-alunos" element={<RelacaoAlunos />} />
                    <Route path="historico-aulas" element={<HistoricoAulas />} />
                    <Route path="relacao-funcionarios" element={<RelacaoFuncionario />} />
                    <Route path="relacao-produtos" element={<Produtos />} />
                  </Route>
                </Route>


                  {/* Rota 404 */}
                  <Route path="*" element={<NotFound />} />


                {/* Página de erro caso o user não tenha permissão */}
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
              </Routes>

              <ToastContainer theme={theme} />
            </Router>
          </ClassProvider>
        </UserProvider>
      </ProductProvider>
    </AuthProvider>

  );
};
