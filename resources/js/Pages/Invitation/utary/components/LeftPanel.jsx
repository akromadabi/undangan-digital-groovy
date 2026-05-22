import React from 'react';
import couplePhoto from '../asset/couple-photo.webp';

export default function LeftPanel({ brideGrooms, invitation }) {
    const coupleNames = brideGrooms?.length >= 2 
        ? `${brideGrooms[0].nickname || brideGrooms[0].full_name} & ${brideGrooms[1].nickname || brideGrooms[1].full_name}`
        : 'Tary & Fachrul';

    return (
        <div className="utary-main__left">
            <img src={invitation.cover_image || couplePhoto} alt={coupleNames} className="utary-main__left-img" />
            <div className="utary-main__left-overlay">
                <div className="utary-main__left-pretitle">THE WEDDING OF</div>
                <div className="utary-main__left-title">{coupleNames.toUpperCase()}</div>
                <div className="utary-main__left-quote">
                    &ldquo;{invitation.closing_text || 'I love you, I am who I am because of you. You are every reason, every hope and every dream. I’ve ever had and no matter what happens to us in the future, every day we are together is the greatest day of my life. I will always be yours.'}&rdquo;
                </div>
            </div>
        </div>
    );
}
