import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export default function Card({ header, footer, as: Tag = 'div', className = '', children, ...rest }: CardProps) {
  return (
    <Tag className={`card ${className}`} {...rest}>
      {header ? <div className="card-header">{header}</div> : null}
      <div>
        {children}
      </div>
      {footer ? <div className="card-footer">{footer}</div> : null}
    </Tag>
  );
}


