import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Card({ header, footer, className = '', children, ...rest }: CardProps) {
  return (
    <div className={`card ${className}`} {...rest}>
      {header && <div className="card-header">{header}</div>}
      <div>{children}</div>
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}
