import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const usePopup = (className) => {
  const location = useLocation();

  const ref = useRef(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (location.state && location.state.popup) {
      setContent(location.state.popup);

      delete location.state.popup;

      window.history.replaceState(location.state, '', location.pathname);
    }
  }, [location.state]);

  useEffect(() => {
    if (content !== '' && ref.current) {
      ref.current.classList.remove(className);

      setTimeout(() => {
        if (ref.current) {
          ref.current.classList.add(className);
        }
        setTimeout(() => {
          if (ref.current) {
            setContent('');
          }
        }, 2000);
      }, 3000);
    }
  }, [content, ref.current]);

  return [ref, content, setContent];
};

export default usePopup;
