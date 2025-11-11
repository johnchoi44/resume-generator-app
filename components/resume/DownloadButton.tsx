'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export interface ResumeData {
  skills: Array<{
    category: string;
    items: string;
  }>;
  experiences: Array<{
    position: string;
    company: string;
    location: string;
    date_from: string;
    date_to: string;
    description: string[];
  }>;
  projects: Array<{
    name: string;
    position?: string;
    date_from: string;
    date_to: string;
    description: string[];
  }>;
}

interface DownloadButtonProps {
  data: ResumeData;
  targetRole?: string;
}

export function DownloadButton({ data, targetRole }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Call API to generate DOCX using Word template
      const response = await fetch('/api/download-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData: data,
          targetRole,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate resume');
      }

      // Get the DOCX blob
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename
      const rolePart = targetRole
        ? `_${targetRole.replace(/\s+/g, '_')}`
        : '';
      const datePart = new Date().toISOString().split('T')[0];
      link.download = `John_Choi_Resume${rolePart}_${datePart}.docx`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate DOCX:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="w-full"
        size="lg"
      >
        {isDownloading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating DOCX...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download DOCX
          </span>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Your resume will be downloaded as a Word document (.docx)
      </p>
    </div>
  );
}
