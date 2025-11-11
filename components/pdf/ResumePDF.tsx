'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Define types for resume data
interface Skill {
  category: string;
  items: string;
}

interface Experience {
  position: string;
  company: string;
  location: string;
  date_from: string;
  date_to: string;
  description: string[];
}

interface Project {
  name: string;
  position?: string;
  date_from: string;
  date_to: string;
  description: string[];
}

export interface ResumeData {
  skills: Skill[];
  experiences: Experience[];
  projects: Project[];
}

interface ResumePDFProps {
  data: ResumeData;
  personalInfo?: {
    name: string;
    email: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    location?: string;
  };
}

// Create styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 9,
    textAlign: 'center',
    color: '#333333',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#000000',
    paddingBottom: 3,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  skillCategory: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  skillCategoryName: {
    fontFamily: 'Helvetica-Bold',
    width: 120,
  },
  skillItems: {
    flex: 1,
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  experienceTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  experienceDates: {
    fontSize: 9,
    color: '#333333',
  },
  experienceCompany: {
    fontStyle: 'italic',
    marginBottom: 4,
    fontSize: 9,
    color: '#555555',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 3,
    paddingLeft: 15,
  },
  bullet: {
    width: 10,
    fontSize: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.4,
  },
  projectItem: {
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  projectName: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  projectDates: {
    fontSize: 9,
    color: '#333333',
  },
});

const ResumePDF: React.FC<ResumePDFProps> = ({ data, personalInfo }) => {
  const defaultPersonalInfo = {
    name: 'John Choi',
    email: 'psuybc5222@gmail.com',
    linkedin: 'linkedin.com/in/choi-yongjun',
    github: 'github.com/johnchoi44',
    ...personalInfo,
  };

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{defaultPersonalInfo.name}</Text>
          <Text style={styles.contactInfo}>
            {defaultPersonalInfo.email}
            {defaultPersonalInfo.phone && ` | ${defaultPersonalInfo.phone}`}
            {defaultPersonalInfo.linkedin && ` | ${defaultPersonalInfo.linkedin}`}
            {defaultPersonalInfo.github && ` | ${defaultPersonalInfo.github}`}
          </Text>
        </View>

        {/* Skills Section */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            {data.skills.map((skill, index) => (
              <View key={index} style={styles.skillCategory}>
                <Text style={styles.skillCategoryName}>{skill.category}:</Text>
                <Text style={styles.skillItems}>{skill.items}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience Section */}
        {data.experiences && data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.experienceTitle}>{exp.position}</Text>
                  <Text style={styles.experienceDates}>
                    {exp.date_from} - {exp.date_to}
                  </Text>
                </View>
                <Text style={styles.experienceCompany}>
                  {exp.company}, {exp.location}
                </Text>
                {exp.description.map((bullet, bulletIndex) => (
                  <View key={bulletIndex} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>
                    {project.name}
                    {project.position && ` (${project.position})`}
                  </Text>
                  <Text style={styles.projectDates}>
                    {project.date_from} - {project.date_to}
                  </Text>
                </View>
                {project.description.map((bullet, bulletIndex) => (
                  <View key={bulletIndex} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.bulletText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
