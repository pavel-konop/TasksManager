import React from 'react';
import { cn } from '../../lib/utils';
import styles from './Button.module.css';

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  const variantClass = styles[variant] || styles.default;
  const sizeClass = styles[size] || '';

  return (
    <button
      className={cn(styles.button, variantClass, sizeClass, className)}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button };