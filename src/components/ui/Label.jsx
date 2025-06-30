import React from 'react';
import { cn } from '../../lib/utils';
import styles from './Label.module.css';

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn(styles.label, className)} {...props} />
));
Label.displayName = 'Label';

export { Label };