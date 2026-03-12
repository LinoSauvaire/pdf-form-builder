import { Rnd } from 'react-rnd';
import { FormField } from '../types';
import { FileText, CheckSquare } from 'lucide-react';

interface FieldRectangleProps {
  field: FormField;
  isSelected: boolean;
  onUpdate: (updates: Partial<FormField>) => void;
  onSelect: () => void;
  pageWidth: number;
  pageHeight: number;
}

export default function FieldRectangle({
  field,
  isSelected,
  onUpdate,
  onSelect,
  pageWidth,
  pageHeight,
}: FieldRectangleProps) {
  const pixelX = (field.x / 100) * pageWidth;
  const pixelY = (field.y / 100) * pageHeight;
  const pixelWidth = (field.width / 100) * pageWidth;
  const pixelHeight = (field.height / 100) * pageHeight;

  const isCheckbox = field.type === 'checkbox';

  return (
    <Rnd
      position={{ x: pixelX, y: pixelY }}
      size={{ width: pixelWidth, height: pixelHeight }}
      onDragStop={(_, d) => {
        const relativeX = (d.x / pageWidth) * 100;
        const relativeY = (d.y / pageHeight) * 100;
        onUpdate({ x: relativeX, y: relativeY });
      }}
      onResizeStop={(_, __, ref, ___, position) => {
        const relativeX = (position.x / pageWidth) * 100;
        const relativeY = (position.y / pageHeight) * 100;
        const relativeWidth = (ref.offsetWidth / pageWidth) * 100;
        const relativeHeight = (ref.offsetHeight / pageHeight) * 100;
        onUpdate({
          x: relativeX,
          y: relativeY,
          width: relativeWidth,
          height: relativeHeight,
        });
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`transition-all ${
        isCheckbox ? 'rounded' : 'rounded-sm'
      } ${
        isSelected
          ? isCheckbox
            ? 'border-2 border-green-600 bg-green-500/20'
            : 'border-2 border-blue-600 bg-blue-500/20'
          : isCheckbox
          ? 'border-2 border-green-400 bg-green-500/10 hover:bg-green-500/15'
          : 'border-2 border-blue-400 bg-blue-500/10 hover:bg-blue-500/15'
      }`}
      style={{ zIndex: isSelected ? 20 : 10 }}
      bounds="parent"
      enableResizing={isSelected}
    >
      <div className="w-full h-full flex items-center justify-center pointer-events-none p-1">
        {isCheckbox ? (
          <div className="flex items-center justify-center w-full h-full">
            <CheckSquare 
              size={Math.min(pixelWidth, pixelHeight) * 0.6} 
              className={isSelected ? 'text-green-700' : 'text-green-600'}
              strokeWidth={2.5}
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-center space-y-0.5">
            <div className="flex items-center space-x-1 px-1">
              <FileText 
                size={Math.min(12, pixelHeight * 0.4)} 
                className={isSelected ? 'text-blue-700' : 'text-blue-600'}
              />
              <div className="flex-1 space-y-0.5">
                <div className={`h-0.5 bg-blue-600/40 rounded w-full`}></div>
                <div className={`h-0.5 bg-blue-600/30 rounded w-3/4`}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Rnd>
  );
}
