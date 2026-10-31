import React, { useState, useEffect } from 'react';
import { ScreenId, ParticipantRecord } from '../types';
import { CameraScannerModal } from './CameraScannerModal';
import {
  adminLogin,
  verifyToken,
  adminLogout,
  getStoredToken,
  fetchAdminParticipants,
  verifyAdminParticipant,
  fetchAdminWbsReports,
  decryptAdminWbsReport,
  updateAdminWbsStatus,
  fetchAdminAuditLog,
  verifyAttendance,
  fetchAttendanceSummary,
  fetchAttendanceList,
  downloadAttendanceCsv,
  AttendanceSummary,
  AttendanceScanResult,
  AttendanceListItem,
  AdminWbsReport,
  AuditLogEntry,
} from '../api';

interface AdminPanelScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectParticipantForTicket?: (p: ParticipantRecord) => void;
  liveParticipants?: ParticipantRecord[];
  onUpdateParticipants?: (list: ParticipantRecord[]) => void;
}

export const AdminPanelScreen: React.FC<AdminPanelScreenProps> = ({
  onNavigate,
  onSelectParticipantForTicket,
  liveParticipants,
  onUpdateParticipants,
}) => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ email: string; role: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@simak.ac.id');
  const [loginPassword, setLoginPassword] = useState('SimakAdmin2026!');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // --- Dashboard State ---
  const [activeTab, setActiveTab] = useState<'participants' | 'attendance' | 'wbs' | 'audit'>('participants');
  const [participants, setParticipants] = useState<ParticipantRecord[]>([]);
  const [participantsTotal, setParticipantsTotal] = useState(0);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // --- Attendance Scanner State ---
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [scanResult, setScanResult] = useState<AttendanceScanResult | null>(null);
  const [verifyingAttendance, setVerifyingAttendance] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [recentCheckIns, setRecentCheckIns] = useState<Array<{
    fullName: string;
    seatNumber: string;
    ticketCode: string;
    time: string;
    isHmacVerified?: boolean;
  }>>([]);

  // --- Komparasi 2 Data State ---
  const [attendanceViewGroup, setAttendanceViewGroup] = useState<'hadir' | 'tidak_hadir'>('hadir');
  const [attendanceList, setAttendanceList] = useState<AttendanceListItem[]>([]);
  const [attendanceListTotal, setAttendanceListTotal] = useState(0);
  const [attendanceListLoading, setAttendanceListLoading] = useState(false);

  const [wbsReports, setWbsReports] = useState<AdminWbsReport[]>([]);
  const [wbsLoading, setWbsLoading] = useState(false);
  const [decryptedModal, setDecryptedModal] = useState<{ trackingCode: string; summary: string } | null>(null);
  const [decryptingId, setDecryptingId] = useState<string | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Cek token tersimpan saat mount
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      verifyToken()
        .then((user) => {
          if (user) {
            setIsAuthenticated(true);
            setAdminUser(user);
          } else {
            setIsAuthenticated(false);
          }
        })
        .catch(() => setIsAuthenticated(false));
    }
  }, []);

  // Load data ketika tab aktif berubah
  useEffect(() => {
    if (!isAuthenticated) return;

    if (activeTab === 'participants') {
      loadParticipants();
    } else if (activeTab === 'attendance') {
      loadAttendanceData();
    } else if (activeTab === 'wbs') {
      loadWbsReports();
    } else if (activeTab === 'audit') {
      loadAuditLogs();
    }
  }, [isAuthenticated, activeTab, statusFilter]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await adminLogin({ email: loginEmail, password: loginPassword });
      setIsAuthenticated(true);
      setAdminUser({ email: res.email, role: res.role });
    } catch (err: any) {
      setLoginError(err.message || 'Login gagal. Periksa email dan password.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    setAdminUser(null);
  };

  const loadParticipants = async () => {
    setParticipantsLoading(true);
    try {
      const res = await fetchAdminParticipants({
        status: statusFilter === 'Semua' ? undefined : statusFilter,
        q: searchQuery || undefined,
      });

      let currentList = [...res.participants];
      if (liveParticipants && liveParticipants.length > 0) {
        const existingCodes = new Set(currentList.map((p) => p.ticketCode.toUpperCase()));
        liveParticipants.forEach((p) => {
          if (!existingCodes.has(p.ticketCode.toUpperCase())) {
            if (statusFilter === 'Semua' || p.status?.toUpperCase().includes(statusFilter.toUpperCase())) {
              currentList.unshift(p);
            }
          }
        });
      }

      setParticipants(currentList);
      setParticipantsTotal(Math.max(res.total, currentList.length));
    } catch (err: any) {
      console.error(err);
    } finally {
      setParticipantsLoading(false);
    }
  };

  const handleVerify = async (id: string, name: string) => {
    try {
      await verifyAdminParticipant(id);
      setActionSuccess(`Peserta ${name} berhasil diverifikasi!`);
      setTimeout(() => setActionSuccess(null), 4000);
      loadParticipants();
    } catch (err: any) {
      alert(`Gagal verifikasi: ${err.message}`);
    }
  };

  const loadAttendanceData = async () => {
    setAttendanceLoading(true);
    try {
      const summary = await fetchAttendanceSummary();
      setAttendanceSummary(summary);
    } catch (err: any) {
      console.error('Failed to load attendance summary:', err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const loadAttendanceList = async (group: 'hadir' | 'tidak_hadir') => {
    setAttendanceListLoading(true);
    try {
      const res = await fetchAttendanceList(group, 1, 200);
      setAttendanceList(res.participants);
      setAttendanceListTotal(res.total);
    } catch (err: any) {
      console.error('Failed to load attendance list:', err);
    } finally {
      setAttendanceListLoading(false);
    }
  };

  const handleVerifyCode = async (rawCode: string) => {
    if (!rawCode?.trim()) return;

    setVerifyingAttendance(true);
    setScanResult(null);
    try {
      const input = rawCode.trim();
      const res = await verifyAttendance({ qrPayload: input, ticketCode: input });
      setScanResult(res);

      if (res.success && res.participant) {
        setActionSuccess(`Check-in Berhasil: ${res.participant.fullName} (${res.participant.seatNumber})`);
        setTimeout(() => setActionSuccess(null), 4500);
        setRecentCheckIns((prev) => [
          {
            fullName: res.participant!.fullName,
            seatNumber: res.participant!.seatNumber,
            ticketCode: res.participant!.ticketCode,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            isHmacVerified: res.isHmacVerified,
          },
          ...prev.slice(0, 9),
        ]);
        setQrInput('');
        loadAttendanceData();
        loadParticipants();
        if (onUpdateParticipants) {
          const raw = localStorage.getItem('simak_participants_v1');
          if (raw) {
            try { onUpdateParticipants(JSON.parse(raw)); } catch {}
          }
        }
      }
    } catch (err: any) {
      setScanResult({
        success: false,
        error: err.message || 'Verifikasi gagal. Periksa QR payload.',
      });
    } finally {
      setVerifyingAttendance(false);
    }
  };

  const handleScanSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!qrInput.trim()) return;
    await handleVerifyCode(qrInput);
  };

  const handleManualCheckInTicket = async (ticketCode: string, name: string) => {
    setVerifyingAttendance(true);
    try {
      const res = await verifyAttendance({ ticketCode });
      setScanResult(res);
      if (res.success && res.participant) {
        setActionSuccess(`Check-in Manual Berhasil: ${name}`);
        setTimeout(() => setActionSuccess(null), 4000);
        loadAttendanceData();
        loadParticipants();
      } else if (res.alreadyCheckedIn) {
        alert(`Peserta ${name} sudah pernah check-in sebelumnya.`);
      }
    } catch (err: any) {
      alert(`Gagal check-in: ${err.message}`);
    } finally {
      setVerifyingAttendance(false);
    }
  };

  const loadWbsReports = async () => {
    setWbsLoading(true);
    try {
      const list = await fetchAdminWbsReports();
      setWbsReports(list);
    } catch (err: any) {
      console.error(err);
    } finally {
      setWbsLoading(false);
    }
  };

  const handleDecryptWbs = async (id: string) => {
    setDecryptingId(id);
    try {
      const res = await decryptAdminWbsReport(id);
      setDecryptedModal({ trackingCode: res.trackingCode, summary: res.summary });
    } catch (err: any) {
      alert(`Gagal mendekripsi: ${err.message}`);
    } finally {
      setDecryptingId(null);
    }
  };

  const handleUpdateWbsStatus = async (id: string, status: string, step: number) => {
    try {
      await updateAdminWbsStatus(id, { status, progressStep: step });
      setActionSuccess('Status laporan WBS berhasil diperbarui.');
      setTimeout(() => setActionSuccess(null), 3000);
      loadWbsReports();
    } catch (err: any) {
      alert(`Gagal update status: ${err.message}`);
    }
  };

  const loadAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await fetchAdminAuditLog(1, 50);
      setAuditLogs(res.logs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  const exportCsv = () => {
    if (participants.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }
    const headers = ['Kode Tiket', 'NIM', 'Nama Lengkap', 'WhatsApp', 'Email', 'Kursi', 'Status', 'Sesi'];
    const rows = participants.map((p) => [
      p.ticketCode,
      p.nim,
      `"${p.fullName}"`,
      p.whatsapp,
      p.email,
      p.seatNumber,
      p.status,
      `"${p.session || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `peserta_simak_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─── Tampilan Form Login Jika Belum Login ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-container-low py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-8 shadow-xl border border-outline-variant/40">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
              <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
            </div>
            <h1 className="text-2xl font-extrabold text-on-surface">Panel Kendali Panitia & Satgas</h1>
            <p className="text-sm text-secondary mt-1">
              Portal Terpadu HARLAH 16 Tahun SIMAK Institut STIAMI
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Email Satgas / Panitia
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@simak.ac.id"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary text-sm focus:outline-hidden transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/60 focus:border-primary text-sm focus:outline-hidden transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Memverifikasi Kredensial...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">lock_open</span>
                  <span>Masuk ke Panel Kendali</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
            <button
              type="button"
              onClick={() => onNavigate('beranda')}
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Kembali ke Beranda Utama</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Tampilan Dashboard Admin ───
  return (
    <div className="min-h-screen bg-surface-container-low pb-20">
      {/* Top Banner Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/40 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">shield_person</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-on-surface">Panel Administrasi & Pengawasan</h1>
              <div className="flex items-center gap-2 text-xs text-secondary">
                <span>{adminUser?.email}</span>
                <span>•</span>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-[10px] uppercase">
                  {adminUser?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('beranda')}
              className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Lihat Portal</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-error/10 hover:bg-error/20 text-xs font-bold text-error transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-outline-variant/20 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('participants')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'participants'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            <span>Peserta HARLAH ({participantsTotal})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'attendance'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
            <span>Presensi &amp; Scan QR {attendanceSummary ? `(${attendanceSummary.hadir}/${attendanceSummary.total})` : ''}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wbs')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'wbs'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">security</span>
            <span>Laporan WBS Terenkripsi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl transition-all cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'audit'
                ? 'border-primary text-primary bg-primary/5'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Audit Trail Log</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* ─── TAB 1: PESERTA HARLAH ─── */}
        {activeTab === 'participants' && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Cari Nama / NIM / Tiket..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadParticipants()}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs focus:outline-hidden"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/60 text-xs font-semibold text-on-surface focus:outline-hidden"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="MENUNGGU VERIFIKASI">Menunggu Verifikasi</option>
                  <option value="TERVERIFIKASI">Terverifikasi</option>
                  <option value="HADIR">Hadir</option>
                </select>

                <button
                  type="button"
                  onClick={loadParticipants}
                  className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface cursor-pointer"
                  title="Muat Ulang"
                >
                  <span className="material-symbols-outlined text-[18px]">refresh</span>
                </button>
              </div>

              <button
                type="button"
                onClick={exportCsv}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">file_download</span>
                <span>Export Data CSV</span>
              </button>
            </div>

            {/* Table */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container border-b border-outline-variant/40 text-[11px] font-extrabold uppercase tracking-wider text-secondary">
                    <tr>
                      <th className="py-3 px-4">Kode Tiket</th>
                      <th className="py-3 px-4">Nama & NIM</th>
                      <th className="py-3 px-4">WhatsApp & Email</th>
                      <th className="py-3 px-4">Kursi & Sesi</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi Panitia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {participantsLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-secondary">
                          <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
                            progress_activity
                          </span>
                          <div className="mt-2 font-semibold">Memuat data peserta dari database...</div>
                        </td>
                      </tr>
                    ) : participants.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-secondary">
                          Belum ada peserta yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      participants.map((p) => {
                        const isVerified = p.status === 'TERVERIFIKASI' || p.status === 'HADIR';
                        return (
                          <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-primary">
                              {p.ticketCode}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-on-surface">{p.fullName}</div>
                              <div className="text-[11px] text-secondary font-mono">NIM: {p.nim}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="text-secondary">{p.whatsapp}</div>
                              <div className="text-[11px] text-secondary/70">{p.email}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-extrabold text-on-surface">{p.seatNumber}</span>
                              <div className="text-[10px] text-secondary">{p.session}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                  p.status === 'TERVERIFIKASI'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : p.status === 'HADIR'
                                    ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              {!isVerified && (
                                <button
                                  type="button"
                                  onClick={() => handleVerify(p.id, p.fullName)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                                >
                                  <span className="material-symbols-outlined text-[14px]">check</span>
                                  <span>Verifikasi</span>
                                </button>
                              )}
                              {p.status === 'TERVERIFIKASI' && (
                                <button
                                  type="button"
                                  onClick={() => handleManualCheckInTicket(p.ticketCode, p.fullName)}
                                  disabled={verifyingAttendance}
                                  className="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                                  title="Check-in Kehadiran"
                                >
                                  <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                                  <span>Check-in</span>
                                </button>
                              )}
                              {onSelectParticipantForTicket && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectParticipantForTicket(p);
                                    onNavigate('etiket');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                                  title="Lihat E-Tiket"
                                >
                                  <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                                  <span>Tiket</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB: PRESENSI & SCAN QR ─── */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Metric Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-wider">Total Pendaftar</span>
                  <span className="material-symbols-outlined text-[20px] text-primary">groups</span>
                </div>
                <div className="text-2xl font-black text-on-surface mt-2">
                  {attendanceSummary?.total ?? participantsTotal}
                </div>
                <div className="text-[11px] text-secondary mt-1">Kuota Terdaftar</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Telah Hadir</span>
                  <span className="material-symbols-outlined text-[20px] text-emerald-600">how_to_reg</span>
                </div>
                <div className="text-2xl font-black text-emerald-900 mt-2">
                  {attendanceSummary?.hadir ?? 0}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">Sudah Check-in</div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Terverifikasi</span>
                  <span className="material-symbols-outlined text-[20px] text-blue-600">verified</span>
                </div>
                <div className="text-2xl font-black text-blue-900 mt-2">
                  {attendanceSummary?.terverifikasi ?? 0}
                </div>
                <div className="text-[11px] text-blue-700 mt-1">Siap Hadir Hari-H</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Belum Hadir</span>
                  <span className="material-symbols-outlined text-[20px] text-amber-600">pending_actions</span>
                </div>
                <div className="text-2xl font-black text-amber-900 mt-2">
                  {attendanceSummary?.tidakHadir ?? (attendanceSummary?.total ?? 0)}
                </div>
                <div className="text-[11px] text-amber-700 mt-1">Menunggu di Lokasi</div>
              </div>
            </div>

            {/* Scanner & Manual Input Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Scanner Input */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/40 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
                    </div>
                    <div>
                      <h2 className="text-base font-extrabold text-on-surface">Pemindai QR Tiket HARLAH</h2>
                      <p className="text-[11px] text-secondary">Arahkan barcode scanner fisik, gunakan kamera HP/webcam, atau ketik NIM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                      title="Buka Kamera Pemindai"
                    >
                      <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                      <span>Scan Kamera</span>
                    </button>
                    <button
                      type="button"
                      onClick={loadAttendanceData}
                      className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Perbarui Data Kehadiran"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* Banner Buka Kamera Cepat */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-primary/5 to-transparent border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <span className="material-symbols-outlined text-[24px]">videocam</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-on-surface flex items-center gap-1.5">
                        <span>Pemindai Kamera Live (Webcam & Smartphone)</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">Auto-Detect</span>
                      </h4>
                      <p className="text-[11px] text-secondary">Arahkan kamera ke QR code tiket peserta untuk pencatatan kehadiran instan</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                    <span>Buka Kamera Scan</span>
                  </button>
                </div>

                <form onSubmit={handleScanSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-secondary mb-1.5">
                      Input Payload QR / Kode Tiket / NIM
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        autoFocus
                        value={qrInput}
                        onChange={(e) => setQrInput(e.target.value)}
                        placeholder="Contoh: GUEST-HRL-5CD0:0ca0e7... atau GUEST-HRL-5CD0 atau 2024101099"
                        className="w-full px-4 py-3.5 pr-28 rounded-2xl bg-surface-container-low border-2 border-outline-variant/60 focus:border-primary text-sm font-mono focus:outline-hidden transition-colors shadow-inner"
                      />
                      <button
                        type="submit"
                        disabled={verifyingAttendance || !qrInput.trim()}
                        className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        {verifyingAttendance ? (
                          <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Verifikasi</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Scan Result Feedback Box */}
                {scanResult && (
                  <div className="animate-fadeIn">
                    {scanResult.success && scanResult.participant ? (
                      <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-emerald-600 text-[26px]">verified</span>
                            <span className="font-extrabold text-sm uppercase tracking-wider text-emerald-800">
                              Check-In Kehadiran Berhasil
                            </span>
                          </div>
                          {scanResult.isHmacVerified && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">verified_user</span>
                              HMAC Sah
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-200 text-xs">
                          <div>
                            <span className="text-[10px] text-emerald-700 uppercase font-bold">Nama Peserta</span>
                            <p className="font-extrabold text-base text-emerald-950">{scanResult.participant.fullName}</p>
                            <p className="text-[11px] text-emerald-700 font-mono">NIM: {scanResult.participant.nim}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-700 uppercase font-bold">Nomor Kursi</span>
                            <p className="font-black text-xl text-primary">{scanResult.participant.seatNumber}</p>
                            <p className="text-[11px] text-emerald-700 font-mono">{scanResult.participant.ticketCode}</p>
                          </div>
                        </div>
                      </div>
                    ) : scanResult.alreadyCheckedIn ? (
                      <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-amber-600 text-[26px]">warning</span>
                          <span className="font-extrabold text-sm uppercase tracking-wider text-amber-900">
                            Peringatan: Sudah Pernah Check-In
                          </span>
                        </div>
                        <p className="text-xs text-amber-800">
                          Peserta <strong>{scanResult.participant?.fullName}</strong> ({scanResult.participant?.seatNumber}) telah tercatat hadir pada{' '}
                          <span className="font-bold underline">
                            {new Date(scanResult.participant?.checkedInAt || '').toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                          </span>.
                        </p>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-400 text-red-950 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-red-600 text-[26px]">cancel</span>
                          <span className="font-extrabold text-sm uppercase tracking-wider text-red-900">
                            Verifikasi Gagal
                          </span>
                        </div>
                        <p className="text-xs text-red-800">
                          {scanResult.error || 'Tiket tidak ditemukan atau tanda tangan digital HMAC tidak sah.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Quick Test Bar for Demo / Testing */}
                <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-secondary flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-primary">tips_and_updates</span>
                    <span>Uji cepat dengan tiket yang ada di sistem:</span>
                  </div>
                  {participants.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const p = participants[0];
                        setQrInput(p.qrPayload || p.ticketCode);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface font-bold text-[11px] hover:bg-surface-container-highest cursor-pointer"
                    >
                      Muat {participants[0].ticketCode}
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Live Check-in Feed */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/40 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-sm font-extrabold text-on-surface">Aktivitas Presensi Terkini</h3>
                  </div>
                  <span className="text-[10px] text-secondary font-bold uppercase tracking-wider">Live Feed</span>
                </div>

                {recentCheckIns.length === 0 ? (
                  <div className="py-12 text-center text-secondary text-xs">
                    <span className="material-symbols-outlined text-[36px] text-outline-variant block mb-2">
                      badge
                    </span>
                    Belum ada check-in pada sesi ini. Scan QR tiket untuk memulai.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {recentCheckIns.map((ci, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-extrabold text-xs text-on-surface">{ci.fullName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-secondary mt-0.5">
                            <span className="font-mono">{ci.ticketCode}</span>
                            <span>•</span>
                            <span className="font-bold text-primary">{ci.seatNumber}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {ci.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── PANEL KOMPARASI 2 DATA (Hadir vs Tidak Hadir) ─── */}
        {activeTab === 'attendance' && (
          <div className="mt-8 space-y-6">
            {/* Section Header */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-extrabold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-primary">compare_arrows</span>
                  Komparasi Data: Pendaftar vs Hadir Fisik
                </h2>
                <p className="text-xs text-secondary mt-0.5">
                  Gunakan data ini untuk LPJ, laporan rektorat, dan penentuan hak sertifikat nasional.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setAttendanceViewGroup('hadir');
                    loadAttendanceList('hadir');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    attendanceViewGroup === 'hadir'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                      : 'border-outline-variant bg-surface-container text-secondary hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
                  Hadir Fisik ({attendanceSummary?.hadir ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAttendanceViewGroup('tidak_hadir');
                    loadAttendanceList('tidak_hadir');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    attendanceViewGroup === 'tidak_hadir'
                      ? 'border-red-400 bg-red-50 text-red-800'
                      : 'border-outline-variant bg-surface-container text-secondary hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">person_off</span>
                  Hanya Daftar / Absen ({attendanceSummary?.tidakHadir ?? 0})
                </button>
                <button
                  type="button"
                  onClick={() => downloadAttendanceCsv(attendanceViewGroup)}
                  className="px-4 py-2 rounded-xl text-xs font-extrabold bg-primary text-on-primary hover:bg-primary-container flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Export CSV LPJ
                </button>
              </div>
            </div>

            {/* Progress Bar Visual */}
            {attendanceSummary && (
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-on-surface">
                    Rasio Kehadiran: {attendanceSummary.hadirPersen ?? 0}%
                  </span>
                  <span className="text-secondary">
                    {attendanceSummary.hadir} dari {attendanceSummary.total} pendaftar
                  </span>
                </div>
                <div className="h-4 rounded-full bg-surface-container-high overflow-hidden flex">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-700 flex items-center justify-center"
                    style={{ width: `${attendanceSummary.hadirPersen ?? 0}%` }}
                  >
                    {(attendanceSummary.hadirPersen ?? 0) > 15 && (
                      <span className="text-[9px] font-bold text-white">
                        {attendanceSummary.hadirPersen ?? 0}% Hadir
                      </span>
                    )}
                  </div>
                  <div
                    className="h-full bg-red-300 flex items-center justify-center"
                    style={{ width: `${attendanceSummary.tidakHadirPersen ?? 0}%` }}
                  >
                    {(attendanceSummary.tidakHadirPersen ?? 0) > 15 && (
                      <span className="text-[9px] font-bold text-red-900">
                        {attendanceSummary.tidakHadirPersen ?? 0}% Absen
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span>Hadir Fisik</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-300 inline-block" />
                    <span>Hanya Daftar / Absen</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabel Komparasi */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between">
                <h3 className={`text-xs font-extrabold uppercase tracking-wider ${
                  attendanceViewGroup === 'hadir' ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {attendanceViewGroup === 'hadir' ? '✅ Daftar Hadir Resmi' : '❌ Daftar Tidak Hadir / No-Show'}
                  {' '}<span className="text-secondary font-normal">({attendanceListTotal} orang)</span>
                </h3>
                {attendanceList.length === 0 && !attendanceListLoading && (
                  <button
                    type="button"
                    onClick={() => loadAttendanceList(attendanceViewGroup)}
                    className="text-xs text-primary hover:underline font-bold cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    Muat Data
                  </button>
                )}
              </div>

              {attendanceListLoading ? (
                <div className="py-12 text-center text-secondary text-xs">
                  <span className="material-symbols-outlined text-[36px] text-outline-variant block mb-2 animate-spin">refresh</span>
                  Memuat data...
                </div>
              ) : attendanceList.length === 0 ? (
                <div className="py-12 text-center text-secondary text-xs">
                  <span className="material-symbols-outlined text-[36px] text-outline-variant block mb-2">
                    {attendanceViewGroup === 'hadir' ? 'how_to_reg' : 'person_off'}
                  </span>
                  {attendanceViewGroup === 'hadir'
                    ? 'Belum ada peserta yang check-in. Klik "Muat Data" untuk refresh.'
                    : 'Semua peserta sudah hadir, atau klik "Muat Data" untuk refresh.'
                  }
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant/30 bg-surface-container">
                        <th className="px-4 py-3 font-extrabold text-secondary uppercase tracking-wider">No</th>
                        <th className="px-4 py-3 font-extrabold text-secondary uppercase tracking-wider">Nama / NIM</th>
                        <th className="px-4 py-3 font-extrabold text-secondary uppercase tracking-wider">Prodi</th>
                        <th className="px-4 py-3 font-extrabold text-secondary uppercase tracking-wider">Kode Tiket</th>
                        <th className="px-4 py-3 font-extrabold text-secondary uppercase tracking-wider">
                          {attendanceViewGroup === 'hadir' ? 'Jam Check-In' : 'Tgl Daftar'}
                        </th>
                        <th className="px-4 py-3 font-extrabold text-secondary uppercase tracking-wider">Hak Sertifikat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {attendanceList.map((p, idx) => (
                        <tr
                          key={p.id}
                          className={`transition-colors ${
                            attendanceViewGroup === 'hadir'
                              ? 'hover:bg-emerald-50/40'
                              : 'hover:bg-red-50/30'
                          }`}
                        >
                          <td className="px-4 py-3 text-secondary">{idx + 1}</td>
                          <td className="px-4 py-3">
                            <p className="font-extrabold text-on-surface">{p.fullName}</p>
                            <p className="font-mono text-secondary text-[10px]">{p.nim}</p>
                          </td>
                          <td className="px-4 py-3 text-secondary">{p.programStudi}</td>
                          <td className="px-4 py-3 font-mono text-primary font-bold">{p.ticketCode}</td>
                          <td className="px-4 py-3 text-secondary">
                            {attendanceViewGroup === 'hadir' && p.checkedInAt
                              ? new Date(p.checkedInAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                              : new Date(p.registeredAt).toLocaleDateString('id-ID')
                            }
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                              p.hakSertifikat === 'BERHAK'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {p.hakSertifikat}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: LAPORAN WBS ─── */}
        {activeTab === 'wbs' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-amber-700 mt-0.5">lock</span>
              <div>
                <span className="font-extrabold">Protokol Keamanan WBS (AES-256-GCM): </span>
                Kronologi dan identitas pelapor disimpan dalam bentuk sandi terenkripsi. Setiap tindakan dekripsi diaudit secara permanen di Audit Trail Log.
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-container border-b border-outline-variant/40 text-[11px] font-extrabold uppercase tracking-wider text-secondary">
                    <tr>
                      <th className="py-3 px-4">Kode Tracking</th>
                      <th className="py-3 px-4">Kategori & Unit</th>
                      <th className="py-3 px-4">Tanggal Kejadian</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi Satgas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {wbsLoading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-secondary">
                          <span className="material-symbols-outlined animate-spin text-[28px] text-primary">
                            progress_activity
                          </span>
                          <div className="mt-2 font-semibold">Memuat laporan WBS...</div>
                        </td>
                      </tr>
                    ) : wbsReports.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-secondary">
                          Belum ada laporan pengaduan masuk.
                        </td>
                      </tr>
                    ) : (
                      wbsReports.map((r) => (
                        <tr key={r.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-primary">
                            {r.trackingCode}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-on-surface">{r.category.replace('_', ' ')}</div>
                            <div className="text-[11px] text-secondary">Unit: {r.unitReported}</div>
                          </td>
                          <td className="py-3.5 px-4 text-secondary">
                            {r.incidentDate || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-primary/10 text-primary">
                              {r.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => handleDecryptWbs(r.id)}
                              disabled={decryptingId === r.id}
                              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">key</span>
                              <span>{decryptingId === r.id ? 'Mendekripsi...' : 'Buka Kronologi'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateWbsStatus(r.id, 'Investigasi', 3)}
                              className="px-2.5 py-1.5 rounded-lg bg-secondary-container hover:bg-secondary/20 text-on-secondary-container font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Proses Investigasi
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: AUDIT TRAIL LOG ─── */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-surface-container border-b border-outline-variant/40 text-[11px] font-sans font-extrabold uppercase tracking-wider text-secondary">
                    <tr>
                      <th className="py-3 px-4">Waktu (WIB)</th>
                      <th className="py-3 px-4">Aksi Audit</th>
                      <th className="py-3 px-4">Entitas Terkait</th>
                      <th className="py-3 px-4">Aktor / Email</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {auditLoading ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-secondary font-sans">
                          Memuat rekaman jejak audit...
                        </td>
                      </tr>
                    ) : auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-secondary font-sans">
                          Belum ada aktivitas audit yang terekam.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-surface-container-low/50">
                          <td className="py-3 px-4 text-secondary text-[11px]">
                            {new Date(log.createdAt).toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 font-bold text-primary">
                            {log.action}
                          </td>
                          <td className="py-3 px-4 text-on-surface">
                            {log.entity} ({log.entityId.slice(0, 12)}...)
                          </td>
                          <td className="py-3 px-4 text-secondary">
                            {log.actor?.email || 'SYSTEM'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Kronologi Terdekripsi */}
      {decryptedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/50 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">lock_open</span>
                <h3 className="font-extrabold text-on-surface">Kronologi Pengaduan Terdekripsi</h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded bg-primary/10 text-primary font-bold">
                {decryptedModal.trackingCode}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/40 text-sm leading-relaxed text-on-surface mb-6 max-h-80 overflow-y-auto whitespace-pre-wrap">
              {decryptedModal.summary}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setDecryptedModal(null)}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs cursor-pointer shadow-xs"
              >
                Tutup Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Kamera Pemindai Presensi */}
      <CameraScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScanSuccess={(decodedText) => {
          handleVerifyCode(decodedText);
        }}
      />
    </div>
  );
};
