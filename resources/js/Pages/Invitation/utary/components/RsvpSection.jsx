import React from 'react';
import { OrnamentGuardTop, OrnamentGuardBottom } from './Ornaments';

export default function RsvpSection({ RevealDiv, rsvpForm, handleRsvp, wishForm, handleWish, wishes }) {
    return (
        <section className="utary-section utary-section--padded" id="rsvp">
            <div className="utary-section__inner">
                <OrnamentGuardTop />
                <div className="utary-guard-content">
                    <RevealDiv>
                        <h2 className="utary-rsvp__title">RSVP &amp; Wishes</h2>
                        <p className="utary-gift__desc">
                            Bagi tamu undangan yang akan menghadiri acara pernikahan kami, mohon mengirimkan konfirmasi kehadiran dengan mengisi formulir berikut ini:
                        </p>
                    </RevealDiv>

                    <RevealDiv>
                        <form className="utary-rsvp__form" onSubmit={handleRsvp}>
                            <div className="utary-rsvp__field">
                                <label className="utary-rsvp__label">Konfirmasi Kehadiran</label>
                                <div className="utary-rsvp__radio-group">
                                    {['hadir', 'tidak_hadir', 'belum_pasti'].map(opt => (
                                        <label key={opt} className={`utary-rsvp__radio-label ${rsvpForm.data.attendance === opt ? 'is-active' : ''}`}>
                                            <input type="radio" name="attendance" value={opt} checked={rsvpForm.data.attendance === opt} 
                                                onChange={e => rsvpForm.setData('attendance', e.target.value)} />
                                            {opt === 'hadir' ? 'Hadir' : opt === 'tidak_hadir' ? 'Tidak Hadir' : 'Mungkin'}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {rsvpForm.data.attendance === 'hadir' && (
                                <div className="utary-rsvp__field">
                                    <label className="utary-rsvp__label">Jumlah Tamu</label>
                                    <select className="utary-rsvp__input" value={rsvpForm.data.number_of_guests} onChange={e => rsvpForm.setData('number_of_guests', e.target.value)}>
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Orang</option>)}
                                    </select>
                                </div>
                            )}
                            <button type="submit" disabled={rsvpForm.processing} className="utary-rsvp__btn">
                                {rsvpForm.processing ? 'Mengirim...' : 'Kirim RSVP'}
                            </button>
                        </form>
                    </RevealDiv>

                    <div className="utary-rsvp__divider" style={{ margin: '40px 0', borderTop: '1px solid rgba(200,182,128,0.3)' }} />

                    <RevealDiv>
                        <form className="utary-rsvp__form" onSubmit={handleWish}>
                            <div className="utary-rsvp__field">
                                <label className="utary-rsvp__label">Ucapan & Doa</label>
                                <input type="text" className="utary-rsvp__input" placeholder="Nama Anda" value={wishForm.data.sender_name} onChange={e => wishForm.setData('sender_name', e.target.value)} />
                                <textarea className="utary-rsvp__input" placeholder="Tulis ucapan & doa..." rows="4" 
                                    value={wishForm.data.message} onChange={e => wishForm.setData('message', e.target.value)} style={{ marginTop: '10px' }} />
                            </div>
                            <button type="submit" disabled={wishForm.processing} className="utary-rsvp__btn">
                                {wishForm.processing ? 'Lagi Mengirim...' : 'Kirim Ucapan'}
                            </button>
                        </form>
                    </RevealDiv>

                    <div className="utary-wishes__list" style={{ marginTop: '30px', textAlign: 'left' }}>
                        {wishes?.map((wish, i) => (
                            <div key={wish.id || i} className="utary-wishes__item" style={{ marginBottom: '15px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', borderLeft: '3px solid #c8b680' }}>
                                <div style={{ fontWeight: '600', color: '#c8b680', fontSize: '13px' }}>{wish.sender_name}</div>
                                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>{wish.message}</div>
                                <div style={{ fontSize: '10px', marginTop: '8px', opacity: 0.5 }}>{wish.created_at_human || 'Baru saja'}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <OrnamentGuardBottom />
            </div>
        </section>
    );
}
