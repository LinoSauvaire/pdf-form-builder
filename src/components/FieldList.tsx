import { FormField } from '../types';
import { Trash2, FileText, CheckSquare } from 'lucide-react';

interface FieldListProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onSelectField: (id: string | null) => void;
  onUpdateField: (id: string, updates: Partial<FormField>) => void;
  onDeleteField: (id: string) => void;
}

export default function FieldList({
  fields,
  selectedFieldId,
  onSelectField,
  onUpdateField,
  onDeleteField,
}: FieldListProps) {
  const selectedField = fields.find(f => f.id === selectedFieldId);

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Form Fields</h2>
        <p className="text-sm text-gray-500 mt-1">{fields.length} field{fields.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {fields.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No fields yet</p>
            <p className="text-gray-400 text-xs mt-1">Click on the PDF to add a field</p>
          </div>
        ) : (
          fields.map((field) => (
            <button
              key={field.id}
              onClick={() => onSelectField(field.id)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                field.id === selectedFieldId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {field.type === 'text' ? (
                    <FileText size={16} className="text-gray-600" />
                  ) : (
                    <CheckSquare size={16} className="text-gray-600" />
                  )}
                  <span className="font-medium text-sm text-gray-900">{field.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteField(field.id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-xs text-gray-500 space-y-0.5">
                <div>Page {field.page}</div>
                <div className="flex space-x-3">
                  <span>X: {field.x.toFixed(1)}%</span>
                  <span>Y: {field.y.toFixed(1)}%</span>
                </div>
                <div className="flex space-x-3">
                  <span>W: {field.width.toFixed(1)}%</span>
                  <span>H: {field.height.toFixed(1)}%</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {selectedField && (
        <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4 overflow-auto">
          <h3 className="text-sm font-semibold text-gray-900">Field Properties</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Field Name
              </label>
              <input
                type="text"
                value={selectedField.name}
                onChange={(e) => onUpdateField(selectedField.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter field name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Field Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onUpdateField(selectedField.id, { type: 'text' })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                    selectedField.type === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <FileText size={16} />
                  <span>Text</span>
                </button>
                <button
                  onClick={() => onUpdateField(selectedField.id, { type: 'checkbox' })}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                    selectedField.type === 'checkbox'
                      ? 'bg-green-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <CheckSquare size={16} />
                  <span>Checkbox</span>
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-300 pt-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-3">Position & Size</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    X (%)
                  </label>
                  <input
                    type="number"
                    value={selectedField.x.toFixed(2)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 100) {
                        onUpdateField(selectedField.id, { x: value });
                      }
                    }}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Y (%)
                  </label>
                  <input
                    type="number"
                    value={selectedField.y.toFixed(2)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 100) {
                        onUpdateField(selectedField.id, { y: value });
                      }
                    }}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Width (%)
                  </label>
                  <input
                    type="number"
                    value={selectedField.width.toFixed(2)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value > 0 && value <= 100) {
                        onUpdateField(selectedField.id, { width: value });
                      }
                    }}
                    step="0.1"
                    min="0.1"
                    max="100"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Height (%)
                  </label>
                  <input
                    type="number"
                    value={selectedField.height.toFixed(2)}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (!isNaN(value) && value > 0 && value <= 100) {
                        onUpdateField(selectedField.id, { height: value });
                      }
                    }}
                    step="0.1"
                    min="0.1"
                    max="100"
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
