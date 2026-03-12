import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { FormField } from '../types';
import FieldRectangle from './FieldRectangle';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PDFViewerProps {
  pdfFile: string;
  fields: FormField[];
  selectedFieldId: string | null;
  onAddField: (field: FormField) => void;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onSelectField: (id: string | null) => void;
  getNextFieldName: () => string;
}

export default function PDFViewer({
  pdfFile,
  fields,
  selectedFieldId,
  onAddField,
  onUpdateField,
  onSelectField,
  getNextFieldName,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageScales, setPageScales] = useState<Map<number, { width: number; height: number }>>(new Map());
  const [isDragging, setIsDragging] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageScales(new Map());
  };

  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>, pageNumber: number) => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest('.field-rectangle')) {
      return;
    }

    const currentTarget = event.currentTarget;
    const rect = currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pageScale = pageScales.get(pageNumber);
    if (!pageScale) return;

    const relativeX = (x / pageScale.width) * 100;
    const relativeY = (y / pageScale.height) * 100;

    const newField: FormField = {
      id: `field-${Date.now()}-${Math.random()}`,
      page: pageNumber,
      x: relativeX,
      y: relativeY,
      width: 15,
      height: 5,
      type: 'text',
      name: getNextFieldName(),
    };

    onAddField(newField);
  };

  const onPageLoadSuccess = (pageNumber: number) => (page: any) => {
    const { width, height } = page;
    setPageScales(prev => new Map(prev).set(pageNumber, { width, height }));
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        className="space-y-8"
      >
        {Array.from(new Array(numPages), (_, index) => {
          const pageNumber = index + 1;
          const pageFields = fields.filter(f => f.page === pageNumber);

          return (
            <div key={`page_${pageNumber}`} className="relative bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="absolute top-0 left-0 bg-gray-900 text-white px-3 py-1 text-xs font-medium rounded-br-lg z-10">
                Page {pageNumber}
              </div>
              <div
                className="relative cursor-crosshair"
                onClick={(e) => handlePageClick(e, pageNumber)}
              >
                <Page
                  pageNumber={pageNumber}
                  onLoadSuccess={onPageLoadSuccess(pageNumber)}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                  className="mx-auto"
                />
                {pageFields.map((field) => (
                  <FieldRectangle
                    key={field.id}
                    field={field}
                    isSelected={field.id === selectedFieldId}
                    onUpdate={(updates) => onUpdateField(field.id, updates)}
                    onSelect={() => onSelectField(field.id)}
                    onDragStart={() => setIsDragging(true)}
                    pageWidth={pageScales.get(pageNumber)?.width || 0}
                    pageHeight={pageScales.get(pageNumber)?.height || 0}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </Document>
    </div>
  );
}
