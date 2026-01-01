import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface ExportPDFButtonProps {
  title?: string;
  children: React.ReactNode;
}

export default function ExportPDFButton({ title = 'Report', children }: ExportPDFButtonProps) {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: title,
    pageStyle: `
      @page { size: A4; margin: 16mm; }
      body { -webkit-print-color-adjust: exact; }
    `,
  });

  return (
    <div>
      <div ref={componentRef}>
        {children}
      </div>
      <button
        onClick={handlePrint}
        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export PDF
      </button>
    </div>
  );
}