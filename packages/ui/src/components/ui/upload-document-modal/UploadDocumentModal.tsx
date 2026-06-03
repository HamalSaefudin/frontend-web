import { useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '../alert-dialog';
import { X, Upload, File } from 'lucide-react';

export interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onUpload: (file: File) => Promise<{ success: boolean; message: string }>;
  acceptedFormats?: string[];
  maxFileSize?: number; // in bytes
}

export function UploadDocumentModal({
  open,
  onOpenChange,
  title = 'Upload Document',
  description = 'Drag and drop your file here, or click to select',
  onUpload,
  acceptedFormats = ['.xlsx', '.xls'],
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: UploadDocumentModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef(false);

  const validateFile = (file: File): boolean => {
    setError('');

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      setError(`Only Excel files (${acceptedFormats.join(', ')}) are supported`);
      return false;
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
      setError(`File size must not exceed ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverRef.current = true;
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverRef.current = false;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragOverRef.current = false;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const result = await onUpload(selectedFile);
      setUploadResult(result);
      if (result.success) {
        setSelectedFile(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setSelectedFile(null);
      setError('');
      setUploadResult(null);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            disabled={isUploading}
          >
            <X className="size-5" />
          </button>
        </div>

        <AlertDialogDescription className="space-y-4">
          {!uploadResult ? (
            <>
              {/* Drag and drop area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragOverRef.current
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Upload className="size-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {acceptedFormats.join(', ')} • Max {(maxFileSize / (1024 * 1024)).toFixed(0)}MB
                </p>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleInputChange}
                accept={acceptedFormats.join(',')}
                className="hidden"
                disabled={isUploading}
              />

              {/* File preview */}
              {selectedFile && (
                <div className="border border-border rounded-lg p-3 bg-muted">
                  <div className="flex items-center gap-2">
                    <File className="size-4 text-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="border border-destructive rounded-lg p-3 bg-destructive/10">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {/* Upload button */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors text-foreground disabled:opacity-50"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Upload result */}
              <div
                className={`border rounded-lg p-4 ${
                  uploadResult.success
                    ? 'border-green-500 bg-green-50'
                    : 'border-destructive bg-destructive/10'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    uploadResult.success ? 'text-green-900' : 'text-destructive'
                  }`}
                >
                  {uploadResult.message}
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </>
          )}
        </AlertDialogDescription>
      </AlertDialogContent>
    </AlertDialog>
  );
}
