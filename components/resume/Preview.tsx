'use client';

import { ResumeData } from '@/components/resume/DownloadButton';

interface PreviewProps {
  data: ResumeData;
}

export function Preview({ data }: PreviewProps) {
  const personalInfo = {
    name: 'John Choi',
    email: 'psuybc5222@gmail.com',
    linkedin: 'linkedin.com/in/choi-yongjun',
    github: 'github.com/johnchoi44',
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-h-[800px] overflow-y-auto border border-gray-200">
      {/* Header */}
      <div className="text-center mb-6 pb-4 border-b-2 border-gray-900">
        <h1 className="text-3xl font-bold text-gray-900">{personalInfo.name}</h1>
        <p className="text-sm text-gray-600 mt-2">
          {personalInfo.email}
          <br />
          {personalInfo.linkedin && `${personalInfo.linkedin}`}
          {personalInfo.github && ` | ${personalInfo.github}`}
        </p>
      </div>

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-900 uppercase tracking-wide">
            SKILLS
          </h2>
          {data.skills.map((skill, i) => (
            <div key={i} className="mb-2 flex">
              <span className="font-semibold min-w-[120px]">{skill.category}:</span>
              <span className="flex-1">{skill.items}</span>
            </div>
          ))}
        </section>
      )}

      {/* Experiences */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-900 uppercase tracking-wide">
            EXPERIENCE
          </h2>
          {data.experiences.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base">{exp.position}</h3>
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {exp.date_from} - {exp.date_to}
                </span>
              </div>
              <div className="text-sm italic text-gray-600 mb-2">
                {exp.company}, {exp.location}
              </div>
              <ul className="list-disc ml-5 space-y-1">
                {exp.description.map((bullet, j) => (
                  <li key={j} className="text-sm leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-3 pb-1 border-b border-gray-900 uppercase tracking-wide">
            PROJECTS
          </h2>
          {data.projects.map((proj, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base">
                  {proj.name}
                  {proj.position && ` (${proj.position})`}
                </h3>
                <span className="text-sm text-gray-600 whitespace-nowrap ml-4">
                  {proj.date_from} - {proj.date_to}
                </span>
              </div>
              <ul className="list-disc ml-5 space-y-1 mt-2">
                {proj.description.map((bullet, j) => (
                  <li key={j} className="text-sm leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
