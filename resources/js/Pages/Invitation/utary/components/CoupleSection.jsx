import React from 'react';
import ornamentLeft from '../asset/ornament-left.webp';
import ornamentRight from '../asset/ornament-right.webp';
import frameProfile from '../asset/frame-profile.webp';
import maskProfile from '../asset/mask-profile.webp';

export default function CoupleSection({ RevealDiv, brideGrooms }) {
    return (
        <section className="utary-section utary-section--padded" id="couple">
            <img src={ornamentLeft} alt="" className="utary-ornament utary-ornament--left" />
            <img src={ornamentRight} alt="" className="utary-ornament utary-ornament--right" />
            <div className="utary-section__inner">
                <RevealDiv className="utary-couple__header">
                    <h2 className="utary-couple__title">Bride &amp; Groom</h2>
                    <p className="utary-couple__desc">
                        Dengan segala puji bagi Allah yang telah menciptakan mahluk-Nya berpasang-pasangan, Ya Allah izinkanlah kami merangkai cinta yang Engkau berikan dalam ikatan pernikahan.
                    </p>
                </RevealDiv>

                {brideGrooms?.map((bg, index) => (
                    <React.Fragment key={bg.id || index}>
                        <RevealDiv className="utary-profile">
                            <div className="utary-profile__frame-wrap">
                                <img src={frameProfile} alt="" className="utary-profile__frame" />
                                <img 
                                    src={bg.photo || (index === 0 ? '../asset/utary-1.webp' : '../asset/utary-2.webp')} 
                                    alt={bg.full_name} 
                                    className="utary-profile__photo" 
                                    style={{
                                        WebkitMaskImage: `url(${maskProfile})`,
                                        maskImage: `url(${maskProfile})`,
                                        WebkitMaskSize: 'cover',
                                        maskSize: 'cover',
                                        WebkitMaskPosition: 'center',
                                        maskPosition: 'center',
                                        WebkitMaskRepeat: 'no-repeat',
                                        maskRepeat: 'no-repeat',
                                        objectPosition: `${bg.photo_position_x ?? 50}% ${bg.photo_position_y ?? 50}%`,
                                        transform: `scale(${bg.photo_zoom ?? 1.0})`,
                                        transformOrigin: 'center'
                                    }}
                                />
                            </div>
                            <h3 className="utary-profile__name">{bg.full_name?.toUpperCase()}</h3>
                            {((bg.father_name && bg.father_name.trim() !== '' && bg.father_name !== 'Bapak') || (bg.mother_name && bg.mother_name.trim() !== '' && bg.mother_name !== 'Ibu')) && (
                                <>
                                    <p className="utary-profile__role">{bg.gender === 'wanita' ? 'PUTRI' : 'PUTRA'} {bg.child_order ? `${String(bg.child_order).toUpperCase()}` : ''} DARI</p>
                                    <p className="utary-profile__parents">
                                        {bg.father_name && bg.mother_name && bg.father_name !== 'Bapak' && bg.mother_name !== 'Ibu' ? (
                                            <>Bapak {bg.father_name}<br />&amp; Ibu {bg.mother_name}</>
                                        ) : (bg.father_name && bg.father_name !== 'Bapak') ? (
                                            <>Bapak {bg.father_name}</>
                                        ) : (
                                            <>Ibu {bg.mother_name}</>
                                        )}
                                    </p>
                                </>
                            )}
                            {bg.instagram && (
                                <a href={`https://www.instagram.com/${bg.instagram}`} className="utary-profile__social" target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-instagram" /> {bg.instagram?.toUpperCase()}
                                </a>
                            )}
                        </RevealDiv>

                        {index === 0 && (
                            <RevealDiv variant="zoom" className="utary-ampersand">
                                <div className="utary-ampersand__line" />
                                <span className="utary-ampersand__symbol">&amp;</span>
                                <div className="utary-ampersand__line" />
                            </RevealDiv>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </section>
    );
}
