/**
 * emailService.ts — Layanan pengiriman email konfirmasi tiket HARLAH SIMAK
 */

import nodemailer from 'nodemailer';

interface SendTicketEmailParams {
  toEmail: string;
  fullName: string;
  ticketCode: string;
  seatNumber: string;
  session: string;
  guestCategory: string;
  examRoom?: string;
  gate?: string;
  examDate?: string;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user, pass },
    });
  }

  return transporter;
}

/**
 * Kirim email konfirmasi tiket HARLAH.
 * Jika SMTP belum dikonfigurasi, sistem log simulasi tanpa menggagalkan flow.
 */
export async function sendTicketConfirmationEmail(params: SendTicketEmailParams): Promise<boolean> {
  const {
    toEmail,
    fullName,
    ticketCode,
    seatNumber,
    session,
    guestCategory,
    examRoom = 'Aula Utama',
    gate = 'Pintu Utama',
    examDate = '29 Januari 2027',
  } = params;

  const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f9fb; margin: 0; padding: 24px; color: #1c1b1f; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .header { background: #760009; color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header p { margin: 8px 0 0; font-size: 13px; opacity: 0.9; }
    .body { padding: 32px 28px; }
    .badge { display: inline-block; background: #fdf2f2; color: #760009; font-weight: 700; font-size: 11px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #fed7d7; }
    .ticket-box { background: #fafafa; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 20px; margin: 24px 0; }
    .ticket-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
    .ticket-row:last-child { margin-bottom: 0; }
    .ticket-label { color: #64748b; font-weight: 600; }
    .ticket-val { font-weight: 800; color: #0f172a; }
    .seat-badge { font-size: 24px; font-weight: 900; color: #760009; }
    .footer { background: #f8fafc; padding: 20px 28px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge" style="background: rgba(255,255,255,0.2); color: #fff; border: none;">E-Tiket Resmi HARLAH 16 Tahun</span>
      <h1 style="margin-top: 12px;">SIMAK Institut STIAMI</h1>
      <p>Spesialisasi Mahasiswa Anti Korupsi</p>
    </div>
    <div class="body">
      <p style="font-size: 15px; margin-top: 0;">Halo <strong>${fullName}</strong>,</p>
      <p style="font-size: 13px; color: #475569; line-height: 1.6;">
        Pendaftaran Anda untuk perayaan <strong>HARLAH 16 Tahun SIMAK</strong> telah berhasil tercatat di sistem kami.
        Berikut adalah detail e-tiket dan alokasi tempat duduk Anda:
      </p>

      <div class="ticket-box">
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: bold;">Nomor Kursi Anda</div>
          <div class="seat-badge">${seatNumber}</div>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Kode Tiket:</span>
          <span class="ticket-val" style="font-family: monospace;">${ticketCode}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Kategori Tamu:</span>
          <span class="ticket-val">${guestCategory}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Sesi Acara:</span>
          <span class="ticket-val">${session}</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Ruang / Lokasi:</span>
          <span class="ticket-val">${examRoom} (${gate})</span>
        </div>
        <div class="ticket-row">
          <span class="ticket-label">Tanggal Pelaksanaan:</span>
          <span class="ticket-val">${examDate}</span>
        </div>
      </div>

      <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
        * Harap tunjukkan kode tiket ini atau QR Code di portal mandiri saat memasuki gerbang registrasi di lokasi acara.
      </p>
    </div>
    <div class="footer">
      Panitia Pelaksana HARLAH 16 Tahun SIMAK Institut STIAMI<br>
      Kader KOPASUS — Berani Jujur, Hebat!
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'SIMAK STIAMI <noreply@simak.ac.id>',
    to: toEmail,
    subject: `[E-Tiket] HARLAH SIMAK 16 Tahun — ${fullName} (${ticketCode})`,
    html: htmlContent,
  };

  const mailClient = getTransporter();
  if (!mailClient) {
    console.log(`[Email Simulation] Tiket dikirim ke ${toEmail} | Kode: ${ticketCode} | Kursi: ${seatNumber}`);
    return true;
  }

  try {
    await mailClient.sendMail(mailOptions);
    console.log(`[Email Sent] Berhasil mengirimkan email tiket ke ${toEmail}`);
    return true;
  } catch (err) {
    console.warn(`[Email Warning] Gagal mengirim email via SMTP ke ${toEmail}:`, err);
    return false;
  }
}
