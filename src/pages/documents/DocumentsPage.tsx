import React, { useState, useRef } from 'react';
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import SignatureCanvas from 'react-signature-canvas';
import { saveAs } from 'file-saver';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { FileText } from 'lucide-react';

// Worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface DocumentType {
  id: string;
  name: string;
  file: File | null;
  type: string;
  size: string;
  lastModified: string;
  status: 'Draft' | 'In Review' | 'Signed';
  signature?: string;
}

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const sigCanvasRef = useRef<SignatureCanvas>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB'; // Convert to MB
      const fileType = file.type.split('/')[1] || file.name.split('.').pop() || 'unknown';
      const lastModified = new Date(file.lastModified).toLocaleDateString();

      const newDoc: DocumentType = {
        id: Date.now().toString(),
        name: file.name,
        file,
        type: fileType.toUpperCase(),
        size: fileSize,
        lastModified,
        status: 'Draft',
      };
      setDocuments([...documents, newDoc]);
      setSelectedDocument(newDoc);
    }
  };

  const handleSign = () => {
    if (selectedDocument && sigCanvasRef.current) {
      const signature = sigCanvasRef.current.toDataURL();
      const updatedDocs = documents.map(doc =>
        doc.id === selectedDocument.id ? { ...doc, signature, status: 'Signed' } : doc
      );
      setDocuments(updatedDocs);
      setSelectedDocument({ ...selectedDocument, signature, status: 'Signed' });

      const blob = new Blob([selectedDocument.file as Blob, '\nSignature: ' + signature], { type: 'application/pdf' });
      saveAs(blob, `signed_${selectedDocument.name}`);
    }
  };

  const updateStatus = (id: string, newStatus: DocumentType['status']) => {
    const updatedDocs = documents.map(doc => (doc.id === id ? { ...doc, status: newStatus } : doc));
    setDocuments(updatedDocs);
    if (selectedDocument?.id === id) setSelectedDocument({ ...selectedDocument, status: newStatus });
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center"><FileText className="mr-2" /> Documents</h1>
          <p className="text-gray-600">Manage your startup's important files</p>
        </div>
        <Input type="file" accept=".pdf,.doc,.docx" onChange={handleUpload} className="mb-6 w-full max-w-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Your Documents</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            {documents.map(doc => (
              <div key={doc.id} className="flex flex-col p-2 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedDocument(doc)}>
                <span className="text-lg font-medium">{doc.name}</span>
                <div className="text-sm text-gray-500">
                  <span>Type: {doc.type}</span> | <span>Size: {doc.size}</span> | <span>Modified: {doc.lastModified}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <Badge variant={doc.status === 'Signed' ? 'success' : 'secondary'}>{doc.status}</Badge>
                  <select
                    onChange={(e) => updateStatus(doc.id, e.target.value as DocumentType['status'])}
                    value={doc.status}
                    className="border rounded p-1"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Review">In Review</option>
                    <option value="Signed">Signed</option>
                  </select>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {selectedDocument && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Preview: {selectedDocument.name}</h2>
            </CardHeader>
            <CardBody>
              {selectedDocument.file?.type === 'application/pdf' && (
                <PDFDocument file={selectedDocument.file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                  {Array.from(new Array(numPages), (_, index) => (
                    <Page key={index} pageNumber={index + 1} width={Math.min(600, window.innerWidth - 40)} className="mb-4" />
                  ))}
                </PDFDocument>
              )}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Add E-Signature</h3>
                <SignatureCanvas ref={sigCanvasRef} canvasProps={{ className: 'border border-gray-300 w-full h-40 rounded-md' }} />
                <div className="flex space-x-4 mt-4">
                  <Button variant="outline" onClick={() => sigCanvasRef.current?.clear()}>Clear Signature</Button>
                  <Button onClick={handleSign}>Sign Document</Button>
                </div>
                {selectedDocument.signature && (
                  <img src={selectedDocument.signature} alt="Signature" className="mt-4 border border-gray-300 rounded-md" />
                )}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};