
import React, { useState, useCallback, useRef, DragEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import {
  CloudArrowUpIcon, DocumentTextIcon, XMarkIcon, CheckCircleIcon, CubeTransparentIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';

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

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const validationSchema = Yup.object({
    title: Yup.string().min(5, 'Title must be at least 5 characters').required('Document title is required'),
    courseCode: Yup.string().required('Course code is required'),
    documentType: Yup.string().required('Document type is required'),
    description: Yup.string().max(500, 'Description must not exceed 500 characters')
  });

  const formik = useFormik({
    initialValues: { title: '', courseCode: '', documentType: 'project', description: '' },
    validationSchema,
    onSubmit: async (values) => {
      if (!file) {
        toast.error('Please upload a document first');
        return;
      }
      await handleSubmit(values);
    }
  });

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const uploadedFile = files[0];
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(uploadedFile.type)) {
        toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT.');
        return;
      }
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(uploadedFile);
      toast.success(`${uploadedFile.name} ready to upload`);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setIsDragActive(true);
  };
  
  const handleDragOut = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    handleDrag(e);
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const onBrowseClick = () => {
    inputRef.current?.click();
  };

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

  const handleSubmit = async (values: { title: string; courseCode: string; documentType: string; description: string }) => {
    if (!file) return;
    try {
      setUploading(true);
      setUploadProgress(10);

      const formData = new FormData();
      formData.append('document', file);
      Object.entries(values).forEach(([key, value]) => formData.append(key, value));
      setUploadProgress(30);

      const uploadResponse = await axios.post<{ paragraphHashes: string[]; documentId: string }>(
        `${API_URL}/documents/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const loaded = progressEvent.loaded || 0;
            const total = progressEvent.total || 1;
            const progress = Math.round((loaded * 50) / total);
            setUploadProgress(30 + progress);
          }
        }
      );
      setUploadProgress(80);

      const { paragraphHashes, documentId } = uploadResponse.data;
      const root = generateMerkleRoot(paragraphHashes);
      setHashes(paragraphHashes);
      setMerkleRoot(root);
      setUploadProgress(90);

      await axios.post(`${API_URL}/blockchain/submit`, {
        documentId, merkleRoot: root,
        metadata: { title: values.title, author: user?.name, courseCode: values.courseCode, documentType: values.documentType }
      });
      setUploadProgress(100);

      toast.success('Document successfully uploaded and verified!');
      setTimeout(() => navigate(`/report/${documentId}`), 1500);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h1>
          <p className="text-gray-600">Verify document originality using blockchain technology.</p>
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <form onSubmit={formik.handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Form fields here */}
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
              {/* Other fields */}
            </div>

            <div className="border-t border-gray-200 p-6">
              {!file ? (
                <div onDragEnter={handleDragIn} onDragLeave={handleDragOut} onDragOver={handleDrag} onDrop={handleDrop} onClick={onBrowseClick}
                  className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}`}>
                  <input ref={inputRef} type="file" className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.txt" />
                  <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isDragActive ? "Drop the file here..." : "Drag and drop or click to browse"}
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT (Max 10MB)</p>
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
                  <div className="flex justify-between text-sm text-gray-600 mb-2"><span>Processing...</span><span>{uploadProgress}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex justify-end space-x-4">
              <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition" disabled={uploading}>Cancel</button>
              <button type="submit" disabled={!file || uploading || !formik.isValid} className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center">
                {uploading ? <><svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>Processing...</> : <><CubeTransparentIcon className="h-5 w-5 mr-2" />Submit</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UploadDocument;
