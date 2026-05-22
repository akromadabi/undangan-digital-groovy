import React from 'react';

export default function FooterSection({ RevealDiv, brideGrooms, invitation }) {
    const coupleNames = brideGrooms?.length >= 2 
        ? `${brideGrooms[0].nickname || brideGrooms[0].full_name} & ${brideGrooms[1].nickname || brideGrooms[1].full_name}`
        : 'Tary & Fachrul';

    return (
        <section className="utary-footer">
            <div className="utary-footer__inner">
                <RevealDiv>
                    <div className="utary-footer__pretitle">Terima Kasih</div>
                    <h2 className="utary-footer__title">{coupleNames.toUpperCase()}</h2>
                    <p className="utary-footer__desc">
                        Adalah suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.
                    </p>
                    <div className="utary-footer__copyright">
                        Created with love by <a href="/" target="_blank">Groovy Digital Invitation</a>
                    </div>
                </RevealDiv>
            </div>
        </section>
    );
}
