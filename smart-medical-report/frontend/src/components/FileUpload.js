import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFilePdf, FaFileImage, FaCheck } from 'react-icons/fa';

const FileUpload = ({ onFileSelect, accept = {}, label = 'Upload Medical Report' }) => {
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const getFileIcon = (fileName) => {
    if (fileName?.toLowerCase().endsWith('.pdf')) return <FaFilePdf color="#ef4444" size={28} />;
    return <FaFileImage color="#00d4ff" size={28} />;
  };

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: `2px dashed ${isDragActive ? '#00d4ff' : file ? '#10b981' : 'rgba(0,212,255,0.3)'}`,
          borderRadius: 16,
          padding: '48px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? 'rgba(0,212,255,0.05)' : file ? 'rgba(16,185,129,0.03)' : 'rgba(255,255,255,0.02)',
          transition: 'all 0.3s ease'
        }}
      >
        <input {...getInputProps()} />
        {file ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              {getFileIcon(file.name)}
              <FaCheck color="#10b981" size={20} />
            </div>
            <p style={{ color: '#10b981', fontWeight: 600, marginBottom: 4 }}>File Selected!</p>
            <p style={{ color: '#94a3b8', fontSize: 14 }}>{file.name}</p>
            <p style={{ color: '#64748b', fontSize: 12, marginTop: 4 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p style={{ color: '#00d4ff', fontSize: 13, marginTop: 12 }}>Click to change file</p>
          </div>
        ) : (
          <div>
            <FaCloudUploadAlt color={isDragActive ? '#00d4ff' : '#4b5563'} size={48} style={{ marginBottom: 16 }} />
            <p style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 8 }}>{label}</p>
            <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>
              {isDragActive ? 'Drop the file here!' : 'Drag & drop or click to select'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {['PDF', 'JPG', 'PNG', 'WEBP', 'BMP', 'TIFF'].map(fmt => (
                <span key={fmt} className="tag tag-blue" style={{ fontSize: 11 }}>{fmt}</span>
              ))}
            </div>
            <p style={{ color: '#4b5563', fontSize: 12, marginTop: 12 }}>Maximum file size: 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
