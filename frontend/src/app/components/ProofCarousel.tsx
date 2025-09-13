import { useState, useRef, useEffect } from 'react';
import { ProofTicket } from './ProofTicket';
import { ProofData } from '../types/proof';

interface ProofCarouselProps {
  proofs: ProofData[];
  wallet: string;
  onNewProof: () => void;
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const ProofCarousel = ({ 
  proofs, 
  wallet, 
  onNewProof, 
  currentIndex, 
  onIndexChange 
}: ProofCarouselProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [cardOffset, setCardOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touchX = e.touches[0].clientX;
    const diff = touchX - startX;
    setCurrentX(touchX);
    setCardOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const threshold = 100; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        // Swipe right - previous proof
        onIndexChange(currentIndex - 1);
      } else if (diff < 0 && currentIndex < proofs.length - 1) {
        // Swipe left - next proof
        onIndexChange(currentIndex + 1);
      }
    }
    
    // Reset
    setIsDragging(false);
    setCardOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const mouseX = e.clientX;
    const diff = mouseX - startX;
    setCurrentX(mouseX);
    setCardOffset(diff);
  };

  const handleMouseEnd = () => {
    if (!isDragging) return;
    
    const diff = currentX - startX;
    const threshold = 100;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentIndex > 0) {
        onIndexChange(currentIndex - 1);
      } else if (diff < 0 && currentIndex < proofs.length - 1) {
        onIndexChange(currentIndex + 1);
      }
    }
    
    setIsDragging(false);
    setCardOffset(0);
    setStartX(0);
    setCurrentX(0);
  };

  if (proofs.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <p>Nenhuma prova encontrada</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {/* Cards Stack */}
      <div 
        ref={containerRef}
        className="relative w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
      >
        {proofs.map((proof, index) => {
          const isActive = index === currentIndex;
          const isPrevious = index === currentIndex - 1;
          const isNext = index === currentIndex + 1;
          
          let transform = '';
          let zIndex = 0;
          let opacity = 0;
          
          if (isActive) {
            transform = `translateX(${cardOffset}px) scale(1)`;
            zIndex = 10;
            opacity = 1;
          } else if (isPrevious) {
            transform = `translateX(${-20 + cardOffset}px) scale(0.95)`;
            zIndex = 5;
            opacity = 0.7;
          } else if (isNext) {
            transform = `translateX(${20 + cardOffset}px) scale(0.95)`;
            zIndex = 5;
            opacity = 0.7;
          } else {
            transform = `translateX(${index < currentIndex ? -100 : 100}px) scale(0.9)`;
            zIndex = 1;
            opacity = 0;
          }
          
          return (
            <div
              key={proof.id}
              className="absolute inset-0 transition-all duration-300 ease-out"
              style={{
                transform,
                zIndex,
                opacity,
                pointerEvents: isActive ? 'auto' : 'none'
              }}
            >
              <ProofTicket
                proof={proof}
                wallet={wallet}
                onNewProof={onNewProof}
              />
            </div>
          );
        })}
      </div>
      
      {/* Swipe Indicators */}
      {proofs.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {proofs.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Swipe Hints */}
      {proofs.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 text-center">
          <p>Deslize para navegar entre as provas</p>
          <p className="text-xs mt-1">{currentIndex + 1} de {proofs.length}</p>
        </div>
      )}
    </div>
  );
};