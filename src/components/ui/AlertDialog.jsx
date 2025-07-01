import React from 'react';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { cn } from '../../lib/utils';
import { Button } from './Button';
import styles from './AlertDialog.module.css';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = ({ className, ...props }) => (
  <AlertDialogPrimitive.Portal className={cn(className)} {...props} />
);

const AlertDialogOverlay = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Overlay className={styles.overlay} {...props} ref={ref} />
));

const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content ref={ref} className={cn(styles.content, className)} {...props} />
  </AlertDialogPortal>
));

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn(styles.header, className)} {...props} />
);

const AlertDialogTitle = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Title className={cn(styles.title)} {...props} ref={ref} />
));

const AlertDialogDescription = React.forwardRef((props, ref) => (
  <AlertDialogPrimitive.Description className={cn(styles.description)} {...props} ref={ref} />
));

const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn(styles.footer, className)} {...props} />
);

const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action asChild ref={ref}>
    <Button className={className} {...props} />
  </AlertDialogPrimitive.Action>
));

const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel asChild ref={ref}>
    <Button variant="outline" className={className} {...props} />
  </AlertDialogPrimitive.Cancel>
));

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};