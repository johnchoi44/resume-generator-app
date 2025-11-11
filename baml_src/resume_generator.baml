// Core data classes matching MongoDB schema

class Skill {
  category string @description("Skill category name, e.g., 'Programming Languages'")
  items string[] @description("Array of skills, e.g., ['Python', 'Java', 'SQL']")
}

class Experience {
  position string @description("Job title")
  company string @description("Company name")
  location string @description("Work location, e.g., 'San Francisco, CA'")
  date_from string @description("Start date, e.g., 'Jan 2023'")
  date_to string @description("End date or 'Present'")
  description string[] @description("Array of bullet points describing responsibilities and achievements")
}

class Project {
  name string @description("Project title")
  position string @description("Optional role in project, e.g., 'Team Lead'. Can be empty string.")
  date_from string @description("Project start date")
  date_to string @description("Project end date")
  description string[] @description("Array of bullet points describing the project")
}

class ResumeData {
  skills Skill[] @description("Array of skill categories to include")
  experiences Experience[] @description("Array of work experiences to include")
  projects Project[] @description("Array of projects to include")
}

// Scored classes for correlation-based optimization
class ScoredDescription {
  text string @description("The bullet point text")
  relevance_score float @description("0.0-1.0 relevance score for this specific bullet point")
}

class ScoredExperience {
  position string @description("Job title")
  company string @description("Company name")
  location string @description("Work location")
  date_from string @description("Start date")
  date_to string @description("End date or 'Present'")
  scored_descriptions ScoredDescription[] @description("Array of scored bullet points")
}

class ScoredProject {
  name string @description("Project title")
  position string @description("Optional role in project")
  date_from string @description("Project start date")
  date_to string @description("Project end date")
  scored_descriptions ScoredDescription[] @description("Array of scored bullet points")
}

class ScoredSkill {
  skill Skill @description("The skill category")
  relevance_score float @description("0.0-1.0 correlation score with target role/requirements")
  reasoning string @description("Brief explanation of why this skill category is relevant")
}

class ScoredResumeData {
  scored_experiences ScoredExperience[] @description("All potentially relevant experiences with scores")
  scored_projects ScoredProject[] @description("All potentially relevant projects with scores")
  scored_skills ScoredSkill[] @description("All potentially relevant skill categories with scores")
}

// Input context from database
class MasterExperienceData {
  all_experiences Experience[] @description("Complete work history")
  all_projects Project[] @description("All personal projects")
  all_skills Skill[] @description("All skill categories")
}

// User input
class UserResumeRequest {
  keywords string[] @description("Target skills or technologies, e.g., ['Machine Learning', 'Python', 'AWS']")
  job_description string? @description("Optional job posting text to match against")
  target_role string? @description("Optional desired job title, e.g., 'Senior Data Scientist'")
}

// Main function for generating customized resume
function GenerateCustomizedResume(
  request: UserResumeRequest,
  master_data: MasterExperienceData
) -> ResumeData {
  client Gemini

  prompt #"
    {{ _.role('system') }}
    You are an expert resume writer and career coach. Your task is to create a tailored resume
    by selecting and emphasizing the most relevant experiences from the candidate's complete work history.

    ## Instructions
    1. **Select Relevant Experiences**: Choose 2-4 most relevant work experiences that match the target role/keywords
    2. **Prioritize Recent & Relevant**: Favor recent positions unless older ones are more relevant
    3. **Highlight Matching Skills**: Emphasize skill categories that align with requirements
    4. **Choose Relevant Projects**: Select 2-3 projects that demonstrate required competencies
    5. **Customize Bullet Points**: Rewrite or emphasize bullets that match keywords, but KEEP factual accuracy
    6. **Quantify Impact**: Ensure numbers and metrics are preserved from original
    7. **Maintain Consistency**: Use same tense and format as original bullets
    8. **Use Markdown Formatting**: Apply **bold** formatting to emphasize important keywords, technologies, and key achievements that match the target requirements

    ## Output Requirements
    - Include ONLY the most relevant items (don't include everything)
    - Reorder experiences/projects to put most relevant first
    - Keep original bullet points but you may:
      • Reorder bullets to put most relevant first
      • Slightly rephrase for clarity (preserve facts!)
      • Add emphasis to matching keywords
    - For skills: Include all categories but order them by relevance
    - Ensure output is valid JSON matching the ResumeData schema

    {{ _.role('user') }}
    {{ ctx.output_format }}

    ## Candidate's Complete Background

    ### All Work Experiences
    {% for exp in master_data.all_experiences %}
    - {{ exp.position }} at {{ exp.company }} ({{ exp.date_from }} - {{ exp.date_to }})
      Location: {{ exp.location }}
      {% for bullet in exp.description %}
      • {{ bullet }}
      {% endfor %}
    {% endfor %}

    ### All Projects
    {% for proj in master_data.all_projects %}
    - {{ proj.name }}{% if proj.position %} ({{ proj.position }}){% endif %}
      {{ proj.date_from }} - {{ proj.date_to }}
      {% for bullet in proj.description %}
      • {{ bullet }}
      {% endfor %}
    {% endfor %}

    ### All Skills
    {% for skill in master_data.all_skills %}
    - {{ skill.category }}: {{ skill.items | join(" | ") }}
    {% endfor %}

    ## Target Requirements
    {% if request.target_role %}
    **Target Role**: {{ request.target_role }}
    {% endif %}

    {% if request.keywords %}
    **Required Keywords**: {{ request.keywords | join(", ") }}
    {% endif %}

    {% if request.job_description %}
    **Job Description**:
    {{ request.job_description }}
    {% endif %}

    Generate the customized resume now based on the above requirements.
  "#
}

// Function for generating scored resume data (for 1-page optimization)
function GenerateScoredResume(
  request: UserResumeRequest,
  master_data: MasterExperienceData
) -> ScoredResumeData {
  client Gemini

  prompt #"
    {{ _.role('system') }}
    You are an expert resume writer and career analyst. Your task is to create a tailored resume
    by selecting and emphasizing the most relevant experiences, then scoring each selected item
    for 1-page optimization.

    ## Instructions
    1. **Select Relevant Experiences**: Choose 2-4 most relevant work experiences that match the target role/keywords
    2. **Prioritize Recent & Relevant**: Favor recent positions unless older ones are more relevant
    3. **Highlight Matching Skills**: Emphasize skill categories that align with requirements
    4. **Choose Relevant Projects**: Select 2-3 projects that demonstrate required competencies
    5. **Customize Bullet Points**: Rewrite or emphasize bullets that match keywords, but KEEP factual accuracy
    6. **Quantify Impact**: Ensure numbers and metrics are preserved from original
    7. **Maintain Consistency**: Use same tense and format as original bullets
    8. **Use Markdown Formatting**: Apply **bold** formatting to emphasize important keywords, technologies, and key achievements that match the target requirements
    9. **Score Each Selected Bullet**: Assign a relevance score (0.0-1.0) to each description bullet you include
    10. **Score Skill Categories**: Assign a relevance score to each skill category

    ## Scoring Guidelines
    For each selected bullet point and skill category:
    - 1.0 = Perfectly aligned with requirements (direct match, quantifiable impact)
    - 0.7-0.9 = Highly relevant (strong keyword matches, clear value)
    - 0.4-0.6 = Moderately relevant (some connection to requirements)
    - 0.1-0.3 = Minimally relevant (tangential or weak connection)
    - 0.0 = Not relevant (should not be included)

    ## Output Requirements
    - Include ONLY the most relevant items (don't include everything)
    - Reorder experiences/projects to put most relevant first
    - Keep original bullet points but you may:
      • Reorder bullets to put most relevant first
      • Slightly rephrase for clarity (preserve facts!)
      • Add emphasis to matching keywords
    - For skills: Include all categories but order them by relevance
    - Each selected bullet must have a relevance score
    - Each skill category must have a relevance score
    - Ensure output is valid JSON matching the ScoredResumeData schema

    {{ _.role('user') }}
    {{ ctx.output_format }}

    ## Candidate's Complete Background

    ### All Work Experiences
    {% for exp in master_data.all_experiences %}
    - {{ exp.position }} at {{ exp.company }} ({{ exp.date_from }} - {{ exp.date_to }})
      Location: {{ exp.location }}
      {% for bullet in exp.description %}
      • {{ bullet }}
      {% endfor %}
    {% endfor %}

    ### All Projects
    {% for proj in master_data.all_projects %}
    - {{ proj.name }}{% if proj.position %} ({{ proj.position }}){% endif %}
      {{ proj.date_from }} - {{ proj.date_to }}
      {% for bullet in proj.description %}
      • {{ bullet }}
      {% endfor %}
    {% endfor %}

    ### All Skills
    {% for skill in master_data.all_skills %}
    - {{ skill.category }}: {{ skill.items | join(" | ") }}
    {% endfor %}

    ## Target Requirements
    {% if request.target_role %}
    **Target Role**: {{ request.target_role }}
    {% endif %}

    {% if request.keywords %}
    **Required Keywords**: {{ request.keywords | join(", ") }}
    {% endif %}

    {% if request.job_description %}
    **Job Description**:
    {{ request.job_description }}
    {% endif %}

    Generate the scored resume now based on the above requirements.
    Select only the most relevant items and score each selected bullet point and skill category.
  "#
}
