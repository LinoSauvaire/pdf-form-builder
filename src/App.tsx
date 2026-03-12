import { useState } from 'react';
import { FormField } from './types';
import PDFViewer from './components/PDFViewer';
import FieldList from './components/FieldList';
import { Download } from 'lucide-react';

function App() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);

  const addField = (field: FormField) => {
    setFields([...fields, field]);
    setSelectedFieldId(field.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    if (selectedFieldId === id) {
      setSelectedFieldId(null);
    }
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(fields, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'form-fields.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      setPdfFile(url);
      setFields([]);
      setSelectedFieldId(null);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">PDF Form Builder</h1>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Upload PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        <button
          onClick={exportJSON}
          disabled={fields.length === 0}
          className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} />
          <span>Export JSON</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto bg-gray-100 p-6">
          {pdfFile ? (
            <PDFViewer
              pdfFile={pdfFile}
              fields={fields}
              selectedFieldId={selectedFieldId}
              onAddField={addField}
              onUpdateField={updateField}
              onSelectField={setSelectedFieldId}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg font-medium">No PDF loaded</p>
                <p className="text-gray-400 text-sm mt-2">Upload a PDF to start creating form fields</p>
              </div>
            </div>
          )}
        </div>

        <FieldList
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onUpdateField={updateField}
          onDeleteField={deleteField}
        />
      </div>
    </div>
  );
}

export default App;
