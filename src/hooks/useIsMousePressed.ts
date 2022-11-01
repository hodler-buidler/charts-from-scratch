import { useEffect, useState } from 'react';

export function useIsMousePressed(): boolean {
  const [isMousePressed, setIsMousePressed] = useState(false);

  useEffect(() => {
    function pressed() {
      setIsMousePressed(true);
    }

    function unpressed() {
      setIsMousePressed(false)
    }

    document.body.addEventListener('mousedown', pressed);
    document.body.addEventListener('mouseup', unpressed);
    
    return () => {
      document.body.removeEventListener('mousedown', pressed);
      document.body.removeEventListener('mouseup', unpressed);
    };
  }, []);

  return isMousePressed;
}
