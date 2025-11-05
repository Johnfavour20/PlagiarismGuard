import React, { useState, useRef, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import {
  CloudArrowUpIcon, DocumentTextIcon, XMarkIcon, CheckCircleIcon, CubeTransparentIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Submission, Paragraph, PlagiarizedSource } from '../types';

// Set worker source for pdf.js, which is required for it to work from a CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.2.67/build/pdf.worker.mjs`;

const UploadDocument: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [hashes, setHashes] = useState<string[]>([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object({
    title: Yup.string().min(5, 'Title must be at least 5 characters').required('Document title is required'),
    courseCode: Yup.string().required('Course code is required'),
    documentType: Yup.string().required('Document type is required'),
    description: Yup.string().max(500, 'Description must not exceed 500 characters')
  });

  const formik = useFormik({
    initialValues: { title: '', courseCode: '', documentType: 'project', description: '' },
    validationSchema,
    onSubmit: (values) => {
      if (!file) {
        toast.error('Please upload a document first');
        return;
      }
      handleSubmit(values);
    }
  });

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const uploadedFile = files[0];
      const allowedExtensions = ['.pdf', '.docx', '.txt'];
      const fileExtension = '.' + uploadedFile.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        toast.error('Invalid file type. Please upload PDF, DOCX, or TXT.');
        return;
      }
      if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(uploadedFile);
      toast.success(`${uploadedFile.name} ready to upload`);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDragIn = (e: DragEvent<HTMLDivElement>) => { handleDrag(e); setIsDragActive(true); };
  const handleDragOut = (e: DragEvent<HTMLDivElement>) => { handleDrag(e); setIsDragActive(false); };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };
  const onBrowseClick = () => inputRef.current?.click();

  const removeFile = () => {
    setFile(null);
    setHashes([]);
    setMerkleRoot('');
    if(inputRef.current) inputRef.current.value = "";
    toast.info('File removed');
  };

  const generateMerkleRoot = (paragraphHashes: string[]) => {
    if (paragraphHashes.length === 0) return '';
    let currentLevel = paragraphHashes;
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        if (i + 1 < currentLevel.length) {
          const combined = currentLevel[i] + currentLevel[i + 1];
          nextLevel.push(CryptoJS.SHA256(combined).toString());
        } else {
          nextLevel.push(currentLevel[i]);
        }
      }
      currentLevel = nextLevel;
    }
    return currentLevel[0];
  };

  const processAndCheckPlagiarism = async (text: string): Promise<{paragraphs: Paragraph[], similarityScore: number, plagiarismSources: PlagiarizedSource[]}> => {
    const newParagraphsText = text.split('\n').filter(p => p.trim().length > 10);
    const newParagraphs: Paragraph[] = newParagraphsText.map(p => ({
        text: p,
        hash: CryptoJS.SHA256(p).toString(),
        isPlagiarized: false
    }));

    const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]') as Submission[];
    
    let plagiarizedCount = 0;
    const sources: {[key: string]: {doc: Submission, count: number}} = {};

    newParagraphs.forEach(newP => {
        for (const existingDoc of allSubmissions) {
            if (existingDoc.authorId === user?._id) continue;
            const matchingParagraph = existingDoc.paragraphs.find(existingP => existingP.hash === newP.hash);
            if (matchingParagraph) {
                newP.isPlagiarized = true;
                newP.sourceDocumentId = existingDoc._id;
                plagiarizedCount++;
                if (!sources[existingDoc._id]) {
                    sources[existingDoc._id] = { doc: existingDoc, count: 0 };
                }
                sources[existingDoc._id].count++;
                break;
            }
        }
    });

    const similarityScore = newParagraphs.length > 0 ? (plagiarizedCount / newParagraphs.length) * 100 : 0;
    
    const plagiarismSources: PlagiarizedSource[] = Object.values(sources).map(s => ({
        documentId: s.doc._id,
        documentTitle: s.doc.title,
        authorName: s.doc.authorName,
        similarity: (s.count / newParagraphs.length) * 100
    }));

    return { paragraphs: newParagraphs, similarityScore, plagiarismSources };
  }

  const handleSubmit = async (values: { title: string; courseCode: string; documentType: string; description: string }) => {
    if (!file || !user) return;
    
    setUploading(true);
    setUploadProgress(10);

    const reader = new FileReader();
    reader.onload = async (e) => {
        let text = '';
        try {
            const fileContent = e.target?.result;
            if (!fileContent) throw new Error("Could not read file content.");

            setUploadProgress(20); // Indicate parsing has started
            if (file.name.toLowerCase().endsWith('.txt')) {
                text = fileContent as string;
            } else if (file.name.toLowerCase().endsWith('.docx')) {
                const result = await mammoth.extractRawText({ arrayBuffer: fileContent as ArrayBuffer });
                text = result.value;
            } else if (file.name.toLowerCase().endsWith('.pdf')) {
                const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(fileContent as ArrayBuffer) }).promise;
                const pageTexts = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
                    pageTexts.push(pageText);
                }
                text = pageTexts.join('\n\n');
            }
        } catch (error) {
            console.error('Error parsing file:', error);
            toast.error('Could not extract text from the document.');
            setUploading(false);
            setUploadProgress(0);
            return;
        }

        if (!text || text.trim().length === 0) {
            toast.error('Extracted text is empty. The file might be image-based or corrupted.');
            setUploading(false);
            setUploadProgress(0);
            return;
        }

        setUploadProgress(30);
        await new Promise(res => setTimeout(res, 500));

        const { paragraphs, similarityScore, plagiarismSources } = await processAndCheckPlagiarism(text);
        
        setUploadProgress(70);
        await new Promise(res => setTimeout(res, 500));
        
        const paragraphHashes = paragraphs.map(p => p.hash);
        const root = generateMerkleRoot(paragraphHashes);
        setHashes(paragraphHashes);
        setMerkleRoot(root);

        const newSubmission: Submission = {
            _id: `sub-${Date.now()}`,
            ...values,
            authorId: user._id,
            authorName: user.name,
            university: user.university,
            createdAt: new Date().toISOString(),
            fullText: text,
            paragraphs,
            merkleRoot: root,
            similarityScore,
            status: similarityScore > 25 ? 'flagged' : 'verified',
            plagiarismSources
        };

        setUploadProgress(90);

        const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]');
        allSubmissions.push(newSubmission);
        localStorage.setItem('submissions', JSON.stringify(allSubmissions));

        setUploadProgress(100);
        await new Promise(res => setTimeout(res, 500));

        toast.success('Document processed and report generated!');
        navigate(`/report/${newSubmission._id}`);
    };
    reader.onerror = () => {
        toast.error('Failed to read file.');
        setUploading(false);
    };

    if (file.name.toLowerCase().endsWith('.txt')) {
        reader.readAsText(file);
    } else { // For .docx and .pdf
        reader.readAsArrayBuffer(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h1>
          <p className="text-gray-600">Verify document originality using our secure system.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <form onSubmit={formik.handleSubmit}>
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Document Title *</label>
                  <input id="title" type="text" {...formik.getFieldProps('title')} className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${formik.touched.title && formik.errors.title ? 'border-red-300' : 'border-gray-300 focus:ring-primary-500'}`} />
                  {formik.touched.title && formik.errors.title && <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>}
                </div>
                <div>
                  <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-2">Course Code *</label>
                  <input id="courseCode" type="text" {...formik.getFieldProps('courseCode')} className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${formik.touched.courseCode && formik.errors.courseCode ? 'border-red-300' : 'border-gray-300 focus:ring-primary-500'}`} />
                  {formik.touched.courseCode && formik.errors.courseCode && <p className="mt-1 text-sm text-red-600">{formik.errors.courseCode}</p>}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-6">
              {!file ? (
                <div onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} onDrop={handleDrop} onClick={onBrowseClick}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}>
                  <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} accept=".pdf,.docx,.txt" />
                  <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? "Drop the file here..." : "Drag and drop or click to browse"}
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOCX, TXT (Max 10MB)</p>
                </div>
              ) : (
                <div className="border-2 border-green-300 bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center"><DocumentTextIcon className="h-10 w-10 text-green-600 mr-4" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-700 transition"><XMarkIcon className="h-6 w-6" /></button>
                  </div>
                </div>
              )}
               {uploading && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Processing document...</span><span>{uploadProgress}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition" disabled={uploading}>Cancel</button>
              <button type="submit" disabled={!file || uploading || !formik.isValid} className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center">
                {uploading ? <><svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Processing...</> : <><CubeTransparentIcon className="h-5 w-5 mr-2" />Submit & Check</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocument;
