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
      className={`rounded border-2 transition-all ${
        isSelected
          ? 'border-blue-600 bg-blue-500/20'
          : 'border-blue-400 bg-blue-500/10 hover:bg-blue-500/15'
      }`}
      style={{ zIndex: isSelected ? 20 : 10 }}
      bounds="parent"
      enableResizing={isSelected}
    >
      <div className="w-full h-full flex items-center justify-center pointer-events-none">
        <span className="text-xs font-medium text-blue-900 bg-white/80 px-2 py-0.5 rounded shadow-sm">
          {field.name}
        </span>
      </div>
    </Rnd>
  );
}
