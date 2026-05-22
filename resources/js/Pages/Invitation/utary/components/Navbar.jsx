import React from 'react';

export default function Navbar({ activeNav, scrollTo, navItems }) {
    return (
        <nav className="utary-navbar">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => scrollTo(`section-${item.key}`)}
                    className={`utary-navbar__item ${activeNav === item.key ? 'is-active' : ''}`}
                    title={item.name}
                >
                    <i className={item.icon} />
                </button>
            ))}
        </nav>
    );
}
