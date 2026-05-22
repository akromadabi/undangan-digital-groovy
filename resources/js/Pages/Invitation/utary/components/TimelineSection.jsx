import React from 'react';

export default function TimelineSection({ RevealDiv, loveStories }) {
    if (!loveStories || loveStories.length === 0) return null;

    return (
        <section className="utary-section utary-section--padded" id="story">
            <div className="utary-section__inner">
                <RevealDiv className="utary-timeline__header">
                    <div className="utary-timeline__pretitle" style={{ fontFamily: 'var(--utary-font-display)', fontSize: '18px', color: 'var(--utary-gold)' }}>A Story of</div>
                    <h2 className="utary-timeline__title">JOURNEY OF LOVE</h2>
                    <p className="utary-timeline__desc" style={{ color: 'var(--utary-gold)', fontStyle: 'italic', maxWidth: '340px', margin: '0 auto 40px', lineHeight: '2', fontWeight: '300' }}>
                        &ldquo;Marriage is not a race, it&rsquo;s not about fast or slow.<br/>
                        But, who is ready to carry out a great mandate.&rdquo;
                    </p>
                </RevealDiv>

                <div className="utary-timeline__track--alt" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                    {loveStories.map((s, i) => (
                        <RevealDiv key={s.id || i} className={`utary-timeline__item`} style={{ textAlign: i % 2 === 0 ? 'left' : 'right' }}>
                            <div className="utary-timeline__chapter" style={{ fontFamily: 'var(--utary-font-display)', fontSize: '20px', color: 'var(--utary-gold)', marginBottom: '8px' }}>{s.title}</div>
                            <div className="utary-timeline__text" style={{ fontFamily: 'var(--utary-font-body)', fontSize: '13px', color: 'var(--utary-gold)', lineHeight: '1.9', fontWeight: '300' }}>{s.description}</div>
                        </RevealDiv>
                    ))}
                </div>
            </div>
        </section>
    );
}
