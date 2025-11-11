'use client';

import { useState } from 'react';
import { InputForm } from '@/components/resume/InputForm';
import { Preview } from '@/components/resume/Preview';
import { DownloadButton, ResumeData } from '@/components/resume/DownloadButton';

export default function ResumeGeneratorPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [targetRole, setTargetRole] = useState<string | undefined>();
  const [fitToOnePage, setFitToOnePage] = useState(false);
  const [metadata, setMetadata] = useState<any>(null);

  const handleGenerate = async (input: {
    keywords: string[];
    jobDescription?: string;
    targetRole?: string;
  }) => {
    setIsGenerating(true);
    setError(null);
    setGenerationTime(null);
    setMetadata(null);
    setTargetRole(input.targetRole);

    try {
      const response = await fetch('/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keywords: input.keywords,
          jobDescription: input.jobDescription,
          targetRole: input.targetRole,
          fitToOnePage, // Pass the fitToOnePage flag
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to generate resume');
      }

      if (result.success) {
        setResumeData(result.data.resumeData);
        setGenerationTime(result.data.generationTime);
        setMetadata(result.data.metadata); // Store metadata
      } else {
        throw new Error(result.error?.message || 'Failed to generate resume');
      }
    } catch (err) {
      console.error('Generation failed:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                AI Resume Generator
              </h1>
              <p className="text-gray-600 mt-1">
                Generate customized resumes powered by Google Gemini AI
              </p>
            </div>
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Customize Your Resume
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Enter keywords, paste a job description, or select a preset to generate
                a tailored resume that highlights your most relevant experience.
              </p>

              <InputForm onGenerate={handleGenerate} isGenerating={isGenerating} />

              {/* Fit to 1 Page Toggle */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={fitToOnePage}
                    onChange={(e) => setFitToOnePage(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      Fit to 1 page
                    </span>
                    <p className="text-xs text-gray-500">
                      Automatically removes lowest-scored content to ensure resume fits on one page
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
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
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                How It Works
              </h3>
              <ul className="text-sm text-blue-800 space-y-1 ml-7">
                <li>• Add keywords or paste a job description</li>
                <li>• AI analyzes and selects your most relevant experience</li>
                <li>• Preview your customized resume</li>
                <li>• Download as a professional PDF</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Preview & Download */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-1 flex items-center gap-2">
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Error
                </h3>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {isGenerating && (
              <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200">
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="animate-spin h-12 w-12 text-blue-600 mb-4"
                    viewBox="0 0 24 24"
                  >
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
                  <p className="text-gray-600 font-medium">
                    Generating your customized resume...
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This may take a few seconds
                  </p>
                </div>
              </div>
            )}

            {resumeData && !isGenerating && (
              <>
                {/* Generation Stats */}
                {generationTime && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-800 font-medium">
                        ✓ Resume generated successfully!
                      </span>
                      <span className="text-green-600">
                        {(generationTime / 1000).toFixed(2)}s
                      </span>
                    </div>
                    <div className="text-xs text-green-700 mt-2">
                      Selected {resumeData.experiences.length} experiences,{' '}
                      {resumeData.projects.length} projects, and{' '}
                      {resumeData.skills.length} skill categories
                    </div>

                    {/* Show optimization metadata if available */}
                    {metadata && (
                      <div className="mt-3 pt-3 border-t border-green-200 space-y-1">
                        <div className="text-xs text-green-800 font-medium">
                          Page Estimation:
                        </div>
                        <div className="text-xs text-green-700">
                          • Estimated pages: {metadata.estimatedPages.toFixed(2)}
                        </div>
                        <div className="text-xs text-green-700">
                          • Total lines: {metadata.estimatedLines} ({metadata.totalBulletPoints} bullets)
                        </div>
                        {metadata.removedItems && metadata.removedItems.length > 0 && (
                          <div className="text-xs text-orange-700 mt-2">
                            • Removed {metadata.removedItems.length} items to fit on 1 page
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Download Button */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <DownloadButton
                    data={resumeData}
                    targetRole={targetRole}
                  />
                </div>

                {/* Preview */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">
                    Resume Preview
                  </h2>
                  <Preview data={resumeData} />
                </div>
              </>
            )}

            {!resumeData && !isGenerating && !error && (
              <div className="bg-white rounded-lg shadow-md p-12 border border-gray-200 border-dashed">
                <div className="text-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto mb-4"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <p className="font-medium text-gray-500">No resume yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Fill out the form to generate your customized resume
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-600">
            <p>Built with Next.js, BAML, Google Gemini, and MongoDB</p>
            <p className="mt-1">© 2025 John Choi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
