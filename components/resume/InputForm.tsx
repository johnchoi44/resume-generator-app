'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface InputFormProps {
  onGenerate: (input: {
    keywords: string[];
    jobDescription?: string;
    targetRole?: string;
  }) => void;
  isGenerating: boolean;
}

export function InputForm({ onGenerate, isGenerating }: InputFormProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      keywords,
      jobDescription: jobDescription.trim() || undefined,
      targetRole: targetRole.trim() || undefined,
    });
  };

  const loadPreset = (preset: {
    keywords: string[];
    targetRole: string;
  }) => {
    setKeywords(preset.keywords);
    setTargetRole(preset.targetRole);
  };

  const canSubmit = keywords.length > 0 || jobDescription.trim() || targetRole.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Target Role */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Target Role (Optional)
        </label>
        <Input
          placeholder="e.g., Senior Full Stack Engineer"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Keywords (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Add a keyword (e.g., React, Python)"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
              }
            }}
            disabled={isGenerating}
          />
          <Button
            type="button"
            onClick={addKeyword}
            variant="outline"
            disabled={isGenerating || !keywordInput.trim()}
          >
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[32px]">
          {keywords.map((keyword, i) => (
            <Badge key={i} variant="secondary" className="cursor-pointer">
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(i)}
                className="ml-2 hover:text-red-600"
                disabled={isGenerating}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Job Description (Optional)
        </label>
        <Textarea
          placeholder="Paste the full job posting here..."
          rows={8}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isGenerating}
        />
      </div>

      {/* Generate Button */}
      <Button
        type="submit"
        disabled={isGenerating || !canSubmit}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
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
            Generating...
          </span>
        ) : (
          'Generate Resume'
        )}
      </Button>

      {/* Quick Presets */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-3 font-medium">Quick Presets:</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              loadPreset({
                keywords: ['Machine Learning', 'Python', 'TensorFlow', 'PyTorch'],
                targetRole: 'ML Engineer',
              })
            }
            disabled={isGenerating}
          >
            ML Engineer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              loadPreset({
                keywords: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
                targetRole: 'Frontend Engineer',
              })
            }
            disabled={isGenerating}
          >
            Frontend Engineer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              loadPreset({
                keywords: ['Node.js', 'PostgreSQL', 'AWS', 'Docker'],
                targetRole: 'Backend Engineer',
              })
            }
            disabled={isGenerating}
          >
            Backend Engineer
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              loadPreset({
                keywords: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
                targetRole: 'Full Stack Engineer',
              })
            }
            disabled={isGenerating}
          >
            Full Stack Engineer
          </Button>
        </div>
      </div>
    </form>
  );
}
