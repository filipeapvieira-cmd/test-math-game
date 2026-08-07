'use client';

import { useEffect, useEffectEvent, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface ModalDialogOptions {
  active?: boolean;
  onClose?: () => void;
  restoreFocus?: boolean;
}

function getFocusableElements(dialog: HTMLElement) {
  return [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
    .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
}

export function useModalDialog<T extends HTMLElement>({
  active = true,
  onClose,
  restoreFocus = true,
}: ModalDialogOptions = {}) {
  const dialogRef = useRef<T>(null);
  const shouldRestoreFocus = useEffectEvent(() => restoreFocus);

  useEffect(() => {
    if (!active) return;

    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const currentFocus = document.activeElement;

    if (!currentFocus || !dialog.contains(currentFocus)) {
      const [firstFocusable] = getFocusableElements(dialog);
      (firstFocusable ?? dialog).focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onClose) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(dialog);
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      const focusedElement = document.activeElement;

      if (event.shiftKey && (focusedElement === firstFocusable || !dialog.contains(focusedElement))) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && (focusedElement === lastFocusable || !dialog.contains(focusedElement))) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (!shouldRestoreFocus() || !previouslyFocused) return;

      window.setTimeout(() => {
        if (!document.contains(previouslyFocused)) return;

        const visibleModal = document.querySelector<HTMLElement>(
          '[aria-modal="true"]:not([aria-hidden="true"])',
        );
        if (!visibleModal || visibleModal.contains(previouslyFocused)) {
          previouslyFocused.focus();
        }
      }, 0);
    };
  }, [active, onClose]);

  return dialogRef;
}
