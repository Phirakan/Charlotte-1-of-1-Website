import { useCallback } from 'react';
import Swal from 'sweetalert2';

export function useAlert() {
  const showSuccess = useCallback((message: string, timer = 2000) => {
    return Swal.fire({
      icon: 'success',
      title: 'Success',
      text: message,
      timer,
      timerProgressBar: true,
      showConfirmButton: false,
      position: 'top-end',
      toast: true,
    });
  }, []);

  const showError = useCallback((message: string) => {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message,
      position: 'top-end',
      toast: true,
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }, []);

  const showConfirm = useCallback((
    title: string, 
    text: string, 
    confirmButtonText = 'Yes', 
    cancelButtonText = 'No'
  ) => {
    return Swal.fire({
      title,
      text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });
  }, []);

  return { showSuccess, showError, showConfirm };
}