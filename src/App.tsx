import { useState, useEffect } from 'react';
import { loadStoreData } from './lib/api';
import { StoreInfo, Product, Promo, ShopeeItem } from './types';
import { demoStoreInfo, demoProducts, demoPromos, demoShopee } from './data';
import { useStore } from './store';

import Header from './components/Header';
import Hero from './components/Hero';
import Promos from './components/Promos';
import Menu from './components/Menu';
import ShopeeList from './components/ShopeeList';
import StoreMap from './components/StoreMap';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import MemberModal from './components/MemberModal';
import ZaloButton from './components/ZaloButton';
import ToastContainer from './components/ToastContainer';
import StickyCartBar from './components/StickyCartBar';
import ReorderBanner from './components/ReorderBanner';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMemberOpen, setIsMemberOpen] = useState(false);
  const { setMember, searchQuery } = useStore();

  // State dữ liệu thật từ Google Sheets
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(demoStoreInfo);
  const [products, setProducts]   = useState<Product[]>(demoProducts);
  const [promos, setPromos]       = useState<Promo[]>(demoPromos);
  const [shopeeItems, setShopee]  = useState<ShopeeItem[]>(demoShopee);
  const [loading, setLoading]     = useState(true);

  // 1. Restore member từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cq_member');
    if (stored) {
      try {
        setMember(JSON.parse(stored));
      } catch (e) {
        // ignore
      }
    }
  }, [setMember]);

  // 2. Load dữ liệu từ Apps Script / Google Sheets
  useEffect(() => {
    loadStoreData().then(data => {
      setStoreInfo(data.cuaHang as StoreInfo);
      setProducts(data.sanPham as Product[]);
      setPromos(data.suKien as Promo[]);
      setShopee(data.shopee as ShopeeItem[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-bg-base text-text-dark font-body selection:bg-brand-200/40">
      <Header
        storeInfo={storeInfo}
        onOpenMember={() => setIsMemberOpen(true)}
      />

      <main>
        <Hero storeInfo={storeInfo} />
        <ReorderBanner />
        <Promos promos={promos} isLoading={loading} />
        <Menu
          products={products}
          onOpenProduct={setSelectedProduct}
          searchQuery={searchQuery}
        />
        <ShopeeList items={shopeeItems} storeInfo={storeInfo} />
        <StoreMap storeInfo={storeInfo} />
      </main>

      <Footer storeInfo={storeInfo} />

      {/* Modals & Overlays */}
      <CartDrawer onCheckout={() => setIsCheckoutOpen(true)} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {isCheckoutOpen && (
        <CheckoutModal
          storeInfo={storeInfo}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}

      {isMemberOpen && (
        <MemberModal onClose={() => setIsMemberOpen(false)} />
      )}

      <ZaloButton storeInfo={storeInfo} />

      <ToastContainer />
      <StickyCartBar onCheckout={() => setIsCheckoutOpen(true)} />
    </div>
  );
}
