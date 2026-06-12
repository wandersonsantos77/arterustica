import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import ForProfessionals from './pages/ForProfessionals';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminVariants from './pages/admin/AdminVariants';
import AdminInventory from './pages/admin/AdminInventory';
import AdminLeads from './pages/admin/AdminLeads';
import AdminMaterials from './pages/admin/AdminMaterials';
import AdminMolds from './pages/admin/AdminMolds';
import AdminProduction from './pages/admin/AdminProduction';

// TODO: Adicionar um sistema de busca na página de catálogo para facilitar a navegação
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalog />} />
          <Route path="/produto/:slug" element={<ProductDetail />} />
          <Route path="/para-profissionais" element={<ForProfessionals />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/contato" element={<Contact />} />
        </Route>

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produtos" element={<AdminProducts />} />
          <Route path="variantes" element={<AdminVariants />} />
          <Route path="estoque" element={<AdminInventory />} />
          <Route path="producao" element={<AdminProduction />} />
          <Route path="moldes" element={<AdminMolds />} />
          <Route path="materiais" element={<AdminMaterials />} />
          <Route path="leads" element={<AdminLeads />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
