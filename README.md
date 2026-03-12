# PDF Form Builder

A professional React + TypeScript application for visually placing form fields on PDF documents.

## Features

- Upload and display PDF documents
- Click on PDF to create form fields
- Drag and resize fields with react-rnd
- Support for text and checkbox field types
- Multi-page PDF support
- Field properties editor
- Export field definitions as JSON
- Coordinates relative to PDF pages (compatible with pdf-lib)

## Tech Stack

- React 18
- TypeScript
- react-pdf (PDF rendering)
- react-rnd (drag and resize)
- Tailwind CSS (styling)
- lucide-react (icons)
- Vite (build tool)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Usage

1. Click "Upload PDF" to load a PDF document
2. Click anywhere on the PDF to create a new form field
3. Select a field to edit its properties:
   - Rename the field
   - Change field type (text or checkbox)
4. Drag fields to reposition them
5. Resize fields by selecting them and dragging the corners
6. Click "Export JSON" to download field definitions

## JSON Output Format

```json
[
  {
    "id": "field-1234567890-0.123",
    "page": 1,
    "x": 10.5,
    "y": 20.3,
    "width": 15.0,
    "height": 5.0,
    "type": "text",
    "name": "field_1"
  }
]
```

All coordinates (x, y, width, height) are stored as percentages (0-100) relative to the page dimensions.

## Integration with pdf-lib

The exported JSON can be used with pdf-lib to programmatically add form fields:

```typescript
import { PDFDocument } from 'pdf-lib';

const pdfDoc = await PDFDocument.load(pdfBytes);
const pages = pdfDoc.getPages();

fields.forEach(field => {
  const page = pages[field.page - 1];
  const { width, height } = page.getSize();
  
  const x = (field.x / 100) * width;
  const y = height - ((field.y / 100) * height) - ((field.height / 100) * height);
  const w = (field.width / 100) * width;
  const h = (field.height / 100) * height;
  
  if (field.type === 'text') {
    const form = pdfDoc.getForm();
    form.createTextField(field.name).addToPage(page, { x, y, width: w, height: h });
  } else if (field.type === 'checkbox') {
    const form = pdfDoc.getForm();
    form.createCheckBox(field.name).addToPage(page, { x, y, width: w, height: h });
  }
});
```
