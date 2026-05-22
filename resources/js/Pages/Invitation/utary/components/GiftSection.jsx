import React, { useState } from 'react';
import { OrnamentGuardTop, OrnamentGuardBottom } from './Ornaments';

export default function GiftSection({ RevealDiv, bankAccounts }) {
    if (!bankAccounts || bankAccounts.length === 0) return null;

    const [copied, setCopied] = useState(null);
    const [giftTab, setGiftTab] = useState('amplop');

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <section className="utary-section utary-section--padded" id="gift">
            <div className="utary-section__inner">
                <OrnamentGuardTop />
                <div className="utary-guard-content">
                    <RevealDiv>
                        <h2 className="utary-gift__title">Wedding Gift</h2>
                        <p className="utary-gift__desc">
                            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih Anda, kami akan senang hati menerimanya yang tentu akan semakin melengkapi kebahagiaan kami.
                        </p>
                    </RevealDiv>

                    <RevealDiv>
                        <div className="utary-gift__tabs">
                            <button className={`utary-gift__tab ${giftTab === 'amplop' ? 'is-active' : ''}`} onClick={() => setGiftTab('amplop')}>E-Amplop</button>
                            <button className={`utary-gift__tab ${giftTab === 'registry' ? 'is-active' : ''}`} onClick={() => setGiftTab('registry')}>Gift Registry</button>
                        </div>
                    </RevealDiv>

                    {giftTab === 'amplop' && bankAccounts.map((acc, i) => (
                        <RevealDiv key={acc.id || i}>
                            <div className="utary-gift__card">
                                <div className="utary-gift__bank-name">{acc.bank_name}</div>
                                <div className="utary-gift__account">{acc.account_number}</div>
                                <div className="utary-gift__holder">{acc.account_name}</div>
                                <button className="utary-gift__copy-btn" onClick={() => copyToClipboard(acc.account_number, acc.id)}>
                                    {copied === acc.id ? 'Tersalin!' : 'Salin'}
                                </button>
                            </div>
                        </RevealDiv>
                    ))}

                    {giftTab === 'registry' && (
                        <RevealDiv>
                            <div className="utary-gift__card">
                                <div className="utary-gift__bank-name">KIRIM KADO</div>
                                <div className="utary-gift__holder" style={{ marginBottom: '8px' }}>
                                    Masukan alamat pengiriman di sini atau via dashboard admin.
                                </div>
                                <button className="utary-gift__copy-btn" onClick={() => copyToClipboard('Alamat Pengiriman', 'address')}>
                                    {copied === 'address' ? 'Tersalin!' : 'Salin'}
                                </button>
                            </div>
                        </RevealDiv>
                    )}
                </div>
                <OrnamentGuardBottom />
            </div>
        </section>
    );
}
