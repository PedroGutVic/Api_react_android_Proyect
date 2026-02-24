import { useState } from 'react';
import { motion } from 'framer-motion';

function StarRating({ initialRating = 0, onRate }) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  const getRatingLabel = (score) => {
    const labels = { 1: 'Pobre', 2: 'Regular', 3: 'Bueno', 4: 'Muy Bueno', 5: 'Excelente' };
    return labels[score] || '';
  };

  const getRatingColor = (score) => {
    const colors = {
      1: '#EF4444',
      2: '#F97316',
      3: '#FBBF24',
      4: '#84CC16',
      5: '#22C55E'
    };
    return colors[score] || '#D1D5DB';
  };

  const currentScore = hover || rating;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      alignItems: 'flex-start'
    }}>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
      }}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= currentScore;
          const isHovered = star <= hover;

          return (
            <motion.div
              key={star}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.9 }}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => handleClick(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <motion.span
                animate={{
                  color: isActive ? getRatingColor(currentScore) : '#D1D5DB',
                  textShadow: isActive ? `0 0 15px ${getRatingColor(currentScore)}` : '0 0 0px rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.2 }}
                style={{
                  fontSize: '42px',
                  fontWeight: 'bold',
                  userSelect: 'none',
                  filter: isHovered ? 'drop-shadow(0 0 8px currentColor)' : 'drop-shadow(0 0 0px rgba(0,0,0,0))',
                }}
              >
                ★
              </motion.span>
            </motion.div>
          );
        })}
      </div>

      {currentScore > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 16px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${getRatingColor(currentScore)}20, ${getRatingColor(currentScore)}10)`,
            border: `2px solid ${getRatingColor(currentScore)}40`,
            width: '100%'
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              fontSize: '24px'
            }}
          >
            ★
          </motion.div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: getRatingColor(currentScore),
              letterSpacing: '0.5px'
            }}>
              {currentScore}/5
            </div>
            <div style={{
              fontSize: '12px',
              color: getRatingColor(currentScore),
              opacity: 0.8,
              marginTop: '2px'
            }}>
              {getRatingLabel(currentScore)}
            </div>
          </div>
          <motion.div
            animate={{
              rotate: 360,
              opacity: [1, 0.5, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize: '20px',
              color: getRatingColor(currentScore)
            }}
          >
            ✨
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default StarRating;