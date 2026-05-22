import React from 'react';
import MonogramShield from './Monogram';

export default function CoverSection({ onOpen, invitation, brideGrooms }) {
    const coupleNames = brideGrooms?.length >= 2 
        ? `${brideGrooms[0].nickname || brideGrooms[0].full_name} & ${brideGrooms[1].nickname || brideGrooms[1].full_name}`
        : 'Tary & Fachrul';
    
    const initials = brideGrooms?.length >= 2 
        ? `${brideGrooms[0].nickname?.charAt(0) || ''}${brideGrooms[1].nickname?.charAt(0) || ''}`
        : 'TF';

    return (
        <div className="utary-cover" id="utary-cover">
            <MonogramShield initials={initials} />
            <div className="utary-cover__names">{coupleNames}</div>
            <div className="utary-cover__date">{invitation.event_date_formatted || 'May 2025'}</div>
            <div className="utary-cover__guest-box">
                <div className="utary-cover__guest-label">Tamu Undangan</div>
                <div className="utary-cover__guest-name">{invitation.guest_name || 'Tamu Undangan'}</div>
            </div>
            <div className="utary-cover__desc">
                {invitation.opening_text_short || 'Kami mengundang Anda untuk menghadiri acara pernikahan kami.'}
            </div>
            <button className="utary-cover__btn" onClick={onOpen}>
                BUKA UNDANGAN
            </button>
        </div>
    );
}
