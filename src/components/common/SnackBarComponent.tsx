import { useEffect, useState } from 'react';

interface SnackbarProps {
  message: string;
  open: boolean;
  autoHideDuration?: number;
  onClose?: () => void;
}

// 기본 스타일 정의
const styles: Record<string, React.CSSProperties> = {
  snackbar: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#323232',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '250px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-in-out',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    marginLeft: '8px',
    cursor: 'pointer',
  },
};

const Snackbar: React.FC<SnackbarProps> = ({ message, open, autoHideDuration = 3000, onClose }) => {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      }, autoHideDuration);
      return () => clearTimeout(timer);
    }
  }, [open, autoHideDuration, onClose]);

  if (!visible) {
    return null;
  }

  return (
    <div style={styles.snackbar}>
      {message}
      <button style={styles.closeButton} onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
};

export default Snackbar;
