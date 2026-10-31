import React, { useState, useRef } from 'react';
import { ScreenId, MerchandiseProduct, MerchandiseCategory, CartItem, DanusOrder } from '../types';
import { INITIAL_MERCHANDISE, DANUS_CONTACT } from '../data/merchandiseData';
import { useGsapPageAnimations } from '../hooks/useGsapAnimations';

interface MerchandiseScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const MerchandiseScreen: React.FC<MerchandiseScreenProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useGsapPageAnimations(containerRef);

  // --- Catalog State ---
  const [products] = useState<MerchandiseProduct[]>(INITIAL_MERCHANDISE);
  const [activeCategory, setActiveCategory] = useState<MerchandiseCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // --- Cart State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- Product Detail Modal ---
  const [selectedProduct, setSelectedProduct] = useState<MerchandiseProduct | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [modalQuantity, setModalQuantity] = useState(1);

  // --- Checkout Form State ---
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerNim, setCustomerNim] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'Booth HARLAH 29 Jan' | 'Sekretariat SIMAK' | 'COD Kampus Pusat'>('Booth HARLAH 29 Jan');
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Transfer Bank' | 'Bayar di Tempat (COD)'>('QRIS');
  const [orderNotes, setOrderNotes] = useState('');
  const [completedOrder, setCompletedOrder] = useState<DanusOrder | null>(null);

  // --- Helpers ---
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Cart Actions ---
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleAddToCart = (product: MerchandiseProduct, option?: string, qty = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedOption === option
      );
      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      }
      return [...prev, { product, selectedOption: option, quantity: qty }];
    });
    showToast(`✓ "${product.name}" ditambahkan ke keranjang!`);
  };

  const handleUpdateQuantity = (idx: number, delta: number) => {
    setCart((prev) => {
      const next = [...prev];
      next[idx].quantity += delta;
      if (next[idx].quantity <= 0) {
        return next.filter((_, i) => i !== idx);
      }
      return next;
    });
  };

  const handleRemoveFromCart = (idx: number) => {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  };

  const openProductDetail = (product: MerchandiseProduct) => {
    setSelectedProduct(product);
    setSelectedOption(product.options && product.options.length > 0 ? product.options[0] : '');
    setModalQuantity(1);
  };

  // --- Checkout Submission ---
  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerWhatsapp.trim()) {
      alert('Nama dan Nomor WhatsApp wajib diisi.');
      return;
    }

    const orderId = `ORD-SIMAK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newOrder: DanusOrder = {
      orderId,
      customerName: customerName.trim(),
      nim: customerNim.trim() || '-',
      whatsapp: customerWhatsapp.trim(),
      items: [...cart],
      totalAmount: totalCartPrice,
      pickupMethod,
      paymentMethod,
      status: 'Menunggu Konfirmasi',
      orderedAt: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      notes: orderNotes.trim() || '-',
    };

    setCompletedOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const generateWhatsAppOrderUrl = (order: DanusOrder) => {
    const itemList = order.items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.product.name}${it.selectedOption ? ` (${it.selectedOption})` : ''} x ${it.quantity} = ${formatRupiah(it.product.price * it.quantity)}`
      )
      .join('\n');

    const message = `*KONFIRMASI PESANAN MERCHANDISE HARLAH 16 SIMAK*
ID Pesanan: *${order.orderId}*

*Data Pemesan:*
- Nama: ${order.customerName}
- NIM / Asal: ${order.nim}
- WhatsApp: ${order.whatsapp}

*Daftar Pesanan:*
${itemList}

*Total Pembayaran: ${formatRupiah(order.totalAmount)}*
*Metode Pengambilan:* ${order.pickupMethod}
*Metode Pembayaran:* ${order.paymentMethod}
*Catatan:* ${order.notes || '-'}

Mohon konfirmasi ketersediaan dan panduan pembayaran. Terima kasih telah mendukung Dana Usaha Gerakan Mahasiswa Anti Korupsi SIMAK STIAMI!`;

    return `https://wa.me/${DANUS_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  // --- Filter and Sort ---
  const filteredProducts = products
    .filter((p) => {
      const matchesCat = activeCategory === 'Semua' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div ref={containerRef} className="flex flex-col w-full bg-surface">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 p-4 rounded-2xl bg-emerald-900 text-white shadow-xl border border-emerald-400 flex items-center gap-2.5 animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-emerald-300">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <section className="relative w-full bg-surface-container-lowest py-space-xl overflow-hidden border-b border-surface-container-high">
        <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin relative z-10">
          <nav className="flex items-center gap-space-xs mb-space-md text-secondary font-label-md text-label-md">
            <button
              type="button"
              onClick={() => onNavigate('beranda')}
              className="hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">home</span>
              Beranda
            </button>
            <span>/</span>
            <span className="text-on-surface font-semibold">Toko Merchandise &amp; Danus HARLAH</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                Official Merchandise • Dana Usaha HARLAH 16 Tahun
              </div>
              <h1 className="font-headline-xl text-headline-xl-mobile sm:text-headline-xl text-on-surface font-extrabold tracking-tight">
                Cinderamata Resmi &amp; Penggalangan Dana SIMAK
              </h1>
              <p className="font-body-lg text-body-lg text-secondary leading-relaxed">
                Setiap rupiah dari pembelian cenderamata resmi ini 100% dialokasikan untuk pembiayaan kegiatan
                peringatan HARLAH 16 Tahun, seminar nasional, serta penguatan advokasi antikorupsi mahasiswa STIAMI.
              </p>
            </div>

            {/* Cart Trigger Button */}
            <div className="shrink-0 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative px-5 py-3.5 rounded-2xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                <span>Keranjang Belanja</span>
                {totalCartItems > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary text-xs font-extrabold animate-pulse">
                    {totalCartItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Pillars Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-outline-variant/30 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div>
                <p className="font-extrabold text-on-surface">100% Kas Organisasi</p>
                <p className="text-secondary text-[11px]">Tercatat transparan di Buku Kas Umum (BKU)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">event_seat</span>
              </div>
              <div>
                <p className="font-extrabold text-on-surface">Ambil di Hari-H Acara</p>
                <p className="text-secondary text-[11px]">Bebas ongkir di Booth Danus Auditorium</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <div className="w-8 h-8 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">qr_code</span>
              </div>
              <div>
                <p className="font-extrabold text-on-surface">QRIS &amp; Bayar di Lokasi</p>
                <p className="text-secondary text-[11px]">Bisa bayar tunai/transfer saat pengambilan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <section className="max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl w-full space-y-8">
        {/* Filter and Search Bar */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {(['Semua', 'Apparel', 'Aksesoris', 'Paket Bundle', 'Stationery'] as MerchandiseCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-secondary hover:text-on-surface'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Cari cenderamata..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-hidden"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-semibold text-on-surface focus:outline-hidden"
            >
              <option value="default">Urutan Standar</option>
              <option value="price-asc">Harga Termurah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-secondary bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-[48px] text-outline-variant block mb-2">
              production_quantity_limits
            </span>
            <p className="text-sm font-bold text-on-surface">Produk Tidak Ditemukan</p>
            <p className="text-xs text-secondary mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-surface-container-lowest rounded-3xl border border-outline-variant/40 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                {/* Image & Badge */}
                <div className="relative aspect-4/3 overflow-hidden bg-surface-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-on-primary text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold">
                    Sisa {product.stock} pcs
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      {product.category}
                    </span>
                    <h3
                      onClick={() => openProductDetail(product)}
                      className="font-extrabold text-sm text-on-surface hover:text-primary transition-colors cursor-pointer line-clamp-2"
                    >
                      {product.name}
                    </h3>
                    <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-outline-variant/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-secondary block">Harga Danus:</span>
                      <span className="font-extrabold text-base text-primary">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openProductDetail(product)}
                        className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors cursor-pointer"
                        title="Lihat Rincian"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product, product.options?.[0])}
                        className="px-3 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add_shopping_cart</span>
                        <span>+ Beli</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transparansi Callout Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-surface-container-lowest via-surface to-primary-fixed/20 border border-outline-variant/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-extrabold text-base text-on-surface">
                Transparansi Finansial Dana Usaha SIMAK
              </h3>
              <p className="text-xs text-secondary max-w-xl mt-0.5 leading-relaxed">
                Seluruh dana yang terkumpul dari penjualan merchandise ini dicatat secara terbuka pada Buku Kas Umum
                (BKU) SIMAK dan dapat diaudit oleh seluruh mahasiswa dan alumni.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('transparansi')}
            className="px-5 py-3 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">fact_check</span>
            <span>Lihat Buku Kas Terbuka</span>
          </button>
        </div>
      </section>

      {/* ─── MODAL DETAIL PRODUK ─── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-surface-container-lowest rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/50 flex flex-col md:flex-row max-h-[90vh]">
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-surface-container relative">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              {selectedProduct.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-on-primary text-[10px] font-extrabold">
                  {selectedProduct.badge}
                </span>
              )}
            </div>

            <div className="p-6 w-full md:w-1/2 flex flex-col justify-between overflow-y-auto space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                    {selectedProduct.category}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <h2 className="text-lg font-extrabold text-on-surface leading-snug">
                  {selectedProduct.name}
                </h2>
                <div className="text-xl font-extrabold text-primary">
                  {formatRupiah(selectedProduct.price)}
                </div>

                <p className="text-xs text-secondary leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Option Selector (e.g. Size) */}
                {selectedProduct.options && selectedProduct.options.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
                    <label className="text-xs font-bold text-on-surface">Pilihan Varian / Ukuran:</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedOption(opt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors border ${
                            selectedOption === opt
                              ? 'border-primary bg-primary text-on-primary'
                              : 'border-outline-variant bg-surface-container text-secondary hover:text-on-surface'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-1.5 pt-2 border-t border-outline-variant/30">
                  <label className="text-xs font-bold text-on-surface">Jumlah Pesan:</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setModalQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm min-w-8 text-center">{modalQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setModalQuantity((q) => Math.min(selectedProduct.stock, q + 1))}
                      className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                    <span className="text-xs text-secondary">
                      (Subtotal: <strong>{formatRupiah(selectedProduct.price * modalQuantity)}</strong>)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleAddToCart(selectedProduct, selectedOption, modalQuantity);
                    setSelectedProduct(null);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                  <span>Masukkan ke Keranjang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL / DRAWER KERANJANG BELANJA ─── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col justify-between animate-fadeIn">
            {/* Header */}
            <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">shopping_cart</span>
                <h3 className="font-extrabold text-base text-on-surface">Keranjang Belanja Danus</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Items List */}
            <div className="p-5 flex-1 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="py-20 text-center text-secondary text-xs">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant block mb-2">
                    remove_shopping_cart
                  </span>
                  Keranjang masih kosong. Pilih merchandise di etalase untuk membeli.
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex items-center gap-3"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-xs text-on-surface truncate">{item.product.name}</p>
                      {item.selectedOption && (
                        <p className="text-[10px] text-secondary font-medium">Varian: {item.selectedOption}</p>
                      )}
                      <p className="text-xs font-bold text-primary mt-0.5">
                        {formatRupiah(item.product.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(idx)}
                        className="text-secondary hover:text-error text-xs cursor-pointer"
                        title="Hapus"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                      <div className="flex items-center gap-2 bg-surface-container px-2 py-0.5 rounded-lg text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(idx, -1)}
                          className="hover:text-primary cursor-pointer"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(idx, 1)}
                          className="hover:text-primary cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-outline-variant/30 bg-surface-container-lowest space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Total ({totalCartItems} barang):</span>
                  <span className="font-extrabold text-base text-primary">{formatRupiah(totalCartPrice)}</span>
                </div>
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                  <span>Lanjut ke Formulir Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── MODAL FORMULIR CHECKOUT ─── */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/50 max-h-[92vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
              <div>
                <h3 className="font-extrabold text-lg text-on-surface">Formulir Pemesanan Merchandise</h3>
                <p className="text-xs text-secondary">Isi data pemesan untuk penyiapan nota &amp; pengambilan.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                  Nama Lengkap Pemesan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Ahmad Zaki"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                    Nomor WhatsApp Aktif *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                    NIM / Asal Instansi (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: 2024102001 / Umum"
                    value={customerNim}
                    onChange={(e) => setCustomerNim(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                  Metode Pengambilan Barang *
                </label>
                <select
                  value={pickupMethod}
                  onChange={(e: any) => setPickupMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="Booth HARLAH 29 Jan">Booth Danus Hari-H di Acara (29 Januari, Auditorium)</option>
                  <option value="Sekretariat SIMAK">Sekretariat SIMAK Kampus Pusat STIAMI</option>
                  <option value="COD Kampus Pusat">COD Langsung dengan Panitia di Kampus</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                  Metode Pembayaran *
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-semibold focus:outline-hidden"
                >
                  <option value="QRIS">QRIS Nasional (BCA, GoPay, OVO, ShopeePay, Dana, Mandiri)</option>
                  <option value="Transfer Bank">Transfer Bank BCA SIMAK</option>
                  <option value="Bayar di Tempat (COD)">Bayar Tunai / COD saat Ambil Barang</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Misal: titip ke panitia atas nama Budi"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-hidden"
                />
              </div>

              {/* Order Mini Summary */}
              <div className="p-3.5 rounded-2xl bg-surface-container-low text-xs space-y-1.5 border border-outline-variant/30">
                <div className="flex justify-between text-secondary">
                  <span>Total Produk ({totalCartItems} item):</span>
                  <span className="font-bold text-on-surface">{formatRupiah(totalCartPrice)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Ongkos Pengambilan:</span>
                  <span className="font-bold text-emerald-700">GRATIS (Pickup)</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-outline-variant/30 text-sm font-extrabold text-primary">
                  <span>Total yang Dibayar:</span>
                  <span>{formatRupiah(totalCartPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>Konfirmasi &amp; Terbitkan Nota Pesanan</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL SUKSES PESANAN & NOTA STRUK ─── */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-2xl border border-outline-variant/50 max-h-[92vh] overflow-y-auto space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-primary uppercase">
                {completedOrder.orderId}
              </span>
              <h3 className="font-extrabold text-xl text-on-surface">
                Pesanan Berhasil Dicatat!
              </h3>
              <p className="text-xs text-secondary max-w-sm mx-auto leading-relaxed">
                Terima kasih, <strong>{completedOrder.customerName}</strong>. Pesanan cinderamata HARLAH Anda telah masuk
                ke sistem antrean Danus SIMAK.
              </p>
            </div>

            {/* Payment Details Box */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
                <span className="font-bold text-on-surface">Total Tagihan:</span>
                <span className="font-extrabold text-primary text-sm">
                  {formatRupiah(completedOrder.totalAmount)}
                </span>
              </div>

              {completedOrder.paymentMethod === 'QRIS' && (
                <div className="text-center space-y-2 py-2">
                  <p className="text-[11px] text-secondary font-bold">Pindai QRIS Resmi SIMAK STIAMI:</p>
                  <img
                    src={DANUS_CONTACT.qrisImageUrl}
                    alt="QRIS SIMAK"
                    className="w-44 h-44 mx-auto rounded-xl border border-outline-variant/50 bg-white p-2 shadow-sm"
                  />
                  <p className="text-[10px] text-secondary">Menerima semua e-wallet &amp; m-banking nasional.</p>
                </div>
              )}

              {completedOrder.paymentMethod === 'Transfer Bank' && (
                <div className="space-y-1.5 py-1">
                  <p className="text-[11px] text-secondary font-bold">Rekening Resmi SIMAK STIAMI:</p>
                  <div className="p-3 rounded-xl bg-white border border-outline-variant/40 space-y-0.5">
                    <p className="font-extrabold text-on-surface">{DANUS_CONTACT.bankAccount.bank}</p>
                    <p className="font-mono font-bold text-primary text-sm">{DANUS_CONTACT.bankAccount.accountNumber}</p>
                    <p className="text-[11px] text-secondary">a.n. {DANUS_CONTACT.bankAccount.accountHolder}</p>
                  </div>
                </div>
              )}

              {completedOrder.paymentMethod === 'Bayar di Tempat (COD)' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                  <p className="font-bold">Pembayaran Tunai / COD di Meja Acara:</p>
                  <p className="text-[11px] mt-0.5">
                    Harap siapkan uang pas saat mengambil pesanan di Booth Danus pada hari acara.
                  </p>
                </div>
              )}

              <div className="text-[11px] text-secondary border-t border-outline-variant/30 pt-2 space-y-0.5">
                <p><strong>Pengambilan:</strong> {completedOrder.pickupMethod}</p>
                <p><strong>Waktu Pesan:</strong> {completedOrder.orderedAt}</p>
              </div>
            </div>

            {/* Direct WhatsApp Confirmation Button */}
            <div className="space-y-2.5">
              <a
                href={generateWhatsAppOrderUrl(completedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Kirim Bukti / Konfirmasi ke WhatsApp Danus</span>
              </a>

              <button
                type="button"
                onClick={() => setCompletedOrder(null)}
                className="w-full py-2.5 text-xs font-bold text-secondary hover:text-on-surface cursor-pointer"
              >
                Tutup &amp; Kembali ke Katalog
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

