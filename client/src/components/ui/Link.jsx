import React from 'react';

/**
 * Lightweight Custom Link Component for React
 * Supports <Link to="/path"> with client-side history navigation and zero full page reloads.
 */
export default function Link({ to, children, className, onClick, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) onClick(e);
    window.history.pushState(null, '', to);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <a href={to} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
