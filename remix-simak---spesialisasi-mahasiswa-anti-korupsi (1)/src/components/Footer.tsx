import React from 'react';
import { ScreenId } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
}

const FOOTER_DIVISIONS = [
  { label: 'Divisi Acara', waka: 'Waka 1' },
  { label: 'Divisi Korlap', waka: 'Waka 1' },
  { label: 'Divisi Dokumentasi', waka: 'Waka 2' },
  { label: 'Divisi Desain', waka: 'Waka 2' },
  { label: 'Divisi Ekonomi Kreatif', waka: 'Waka 3' },
  { label: 'Divisi Humas', waka: 'Waka 3' },
  { label: 'Divisi Perlengkapan', waka: 'Waka 3' },
  { label: 'Divisi Konsumsi', waka: 'Waka 3' },
];

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const go = (screen: ScreenId) => {
    onNavigate(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (

      <footer className="w-full bg-surface-container-low/70 border-t border-surface-container-high print:hidden">
        <div className="max-w-7xl mx-auto px-margin-mobile sm:px-margin py-space-xl">
          {/* Top Quick Strip: Struktur BPH & 8 Divisi SIMAK */}
          <div className="mb-space-xl p-5 sm:p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-primary">
                <span className="material-symbols-outlined text-[16px]">account_tree</span>
                Struktur Kepemimpinan BPH &amp; 8 Divisi Teknis SIMAK
              </div>
              <p className="text-xs sm:text-sm text-secondary">
                Dikelola oleh Ketua Umum, 3 Wakil Ketua Umum, Sekretaris Umum 1 &amp; 2, Bendahara Umum, serta 8 Divisi Operasional.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {FOOTER_DIVISIONS.map((div) => (
                <button
                  key={div.label}
                  type="button"
                  onClick={() => go('direktori')}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{div.label}</span>
                  <span className="text-[10px] opacity-70 font-mono">({div.waka})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl mb-space-xl">
            {/* Col 1: Brand & Official Channels */}
            <div className="flex flex-col gap-space-md">
              <div className="flex items-center gap-space-sm">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDieLd4FWbknOilP9vJrwkV9-mi7SHHBdyLXm7CPZfAsBvy1PEQr38BL2Ke3TWdw1oDPajnzHk8ktddihhhvNqeG2Meaoti7kY-_8MjZtU0truuzI6oAQtT0BEU6aHZhN-uQSQflV8WpIhfm7DfECQUhkGLbcHpOINuoctNguGF31zycBy-luBj3RzGT_bOojErv_kzTgLrUaqPYY9-IwF58V592i3I9PmbT9aYCDfR8y3inBlzC-wHfdHcim_vWTaOURg"
                  alt="Logo SIMAK"
                  referrerPolicy="no-referrer"
                  className="h-10 object-contain"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-headline-sm text-headline-sm font-bold tracking-tight text-primary">
                      SIMAK
                    </span>
                    <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-sm text-label-sm px-space-xs py-0.5 rounded-full font-bold">
                      15 Tahun Integritas
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    Spesialisasi Mahasiswa Anti Korupsi
                  </span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-secondary leading-relaxed">
                Lembaga mahasiswa independen di Institut STIAMI yang berdedikasi mengawal integritas akademik, advokasi transparansi tata kelola kampus, dan pembinaan kader anti korupsi sejak 29 Januari 2011.
              </p>
              <div className="inline-flex items-center gap-space-xs font-label-md text-label-md text-tertiary">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
                <span>Tegak, Adil, Transparan (2011 – 2026)</span>
              </div>

              {/* Official Social & Media Badges */}
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => go('galeri')}
                  className="px-2.5 py-1 rounded-md bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-xs font-semibold text-on-surface flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    photo_camera
                  </span>
                  <span>@simak_stiami</span>
                </button>
                <button
                  type="button"
                  onClick={() => go('elibrary')}
                  className="px-2.5 py-1 rounded-md bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-xs font-semibold text-on-surface flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">
                    library_books
                  </span>
                  <span>SIMAK Press</span>
                </button>
              </div>
            </div>

            {/* Col 2: Transparansi & Akuntabilitas */}
            <div className="flex flex-col gap-space-md">
              <h4 className="font-label-lg text-label-lg font-bold text-on-surface uppercase tracking-wider">
                Transparansi &amp; Akuntabilitas
              </h4>
              <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-secondary">
                <li>
                  <button
                    type="button"
                    onClick={() => go('merchandise')}
                    className="hover:text-primary transition-colors inline-flex items-center gap-space-xs cursor-pointer text-primary font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">storefront</span>
                    Toko Merchandise &amp; Danus HARLAH
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('transparansi')}
                    className="hover:text-primary transition-colors inline-flex items-center gap-space-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">description</span>
                    Laporan Keuangan Terbuka
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('transparansi')}
                    className="hover:text-primary transition-colors inline-flex items-center gap-space-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">history_edu</span>
                    Audit Kinerja Tahunan
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('elibrary')}
                    className="hover:text-primary transition-colors inline-flex items-center gap-space-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">policy</span>
                    Pakta Integritas &amp; AD/ART
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('whistleblower')}
                    className="hover:text-primary transition-colors inline-flex items-center gap-space-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">campaign</span>
                    Kanal Whistleblower Kampus
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('direktori')}
                    className="hover:text-primary transition-colors inline-flex items-center gap-space-xs cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">badge</span>
                    Struktur BPH &amp; 8 Divisi SIMAK
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Layanan & Program */}
            <div className="flex flex-col gap-space-md">
              <h4 className="font-label-lg text-label-lg font-bold text-on-surface uppercase tracking-wider">
                Layanan &amp; Program
              </h4>
              <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-secondary">
                <li>
                  <button
                    type="button"
                    onClick={() => go('direktori')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Direktori &amp; Buku Induk 15 Angkatan
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('kartu-ujian')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Kartu Ujian &amp; Akademik STIAMI
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('elibrary')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    E-Library Anti Korupsi &amp; Modul
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('etiket')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Verifikasi Sertifikat &amp; Tiket Diklat
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('pendaftaran')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Registrasi Tamu HARLAH (29 Jan)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => go('galeri')}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Dokumentasi Kegiatan &amp; Riset
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Sekretariat Kampus */}
            <div className="flex flex-col gap-space-md">
              <h4 className="font-label-lg text-label-lg font-bold text-on-surface uppercase tracking-wider">
                Sekretariat Jenderal
              </h4>
              <div className="flex flex-col gap-space-sm font-body-md text-body-md text-secondary">
                <div className="flex items-start gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                    location_on
                  </span>
                  <span>
                    Gedung Rektorat &amp; Kemahasiswaan Lt. 3, Institut STIAMI Jakarta Pusat, Jl. Pangkalan Asem No. 55
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                  <span>sekretariat@simak-antikorupsi.or.id</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    assignment_ind
                  </span>
                  <span>Sekretaris Umum 1 &amp; 2: Elvira &amp; Nabila</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    schedule
                  </span>
                  <span>Senin - Jumat: 09.00 - 17.00 WIB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-space-lg border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-space-md">
            <p className="font-label-md text-label-md text-secondary text-center md:text-left">
              © 2011 - 2026 SIMAK (Spesialisasi Mahasiswa Anti Korupsi) Institut STIAMI. 15 Tahun Merawat Integritas Nusantara.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-space-md font-label-md text-label-md text-secondary">
              <button
                type="button"
                onClick={() => go('elibrary')}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Pedoman Etik
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => go('whistleblower')}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Kerahasiaan Pelapor
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => go('transparansi')}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Laporan Audit Kas
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => go('admin')}
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Panel Satgas & Panitia
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="text-primary font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Ke Atas</span>
                <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
  );
};
