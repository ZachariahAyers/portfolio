import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import DOMPurify from 'dompurify';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes('Present')) return dateStr;
  
  const parts = dateStr.split(' - ');
  return parts.join(' - ');
};

const createResumeHTML = (profileData, tailored = false, jobDescription = '', analysis = '') => {
  const sanitizeText = (text) => {
    if (Array.isArray(text)) {
      return text.map(t => DOMPurify.sanitize(t)).join(' ');
    }
    return DOMPurify.sanitize(text || '');
  };

  const sanitizedData = {
    name: sanitizeText(profileData.personal.name),
    email: sanitizeText(profileData.contact.email),
    location: sanitizeText(profileData.contact.location),
    linkedin: sanitizeText(profileData.contact.linkedin),
    executiveSummary: sanitizeText(profileData.personal.executiveSummary),
    northrop: {
      role: sanitizeText(profileData.experience.northrop.role),
      period: sanitizeText(profileData.experience.northrop.period),
      description: sanitizeText(profileData.experience.northrop.description),
      impact: sanitizeText(profileData.experience.northrop.impact)
    },
    meridianVega: {
      role: sanitizeText(profileData.experience.meridianVega.role),
      period: sanitizeText(profileData.experience.meridianVega.period),
      description: sanitizeText(profileData.experience.meridianVega.description)
    },
    amerisave: {
      period: sanitizeText(profileData.experience.amerisave.period),
      architectDescription: sanitizeText(profileData.experience.amerisave.architect.description),
      architectImpact: sanitizeText(profileData.experience.amerisave.architect.impact)
    },
    skills: {
      languages: profileData.skills.expert.languages.map(s => sanitizeText(s)),
      frontend: profileData.skills.expert.frontend.map(s => sanitizeText(s)),
      backend: profileData.skills.expert.backend.map(s => sanitizeText(s)),
      cloud: profileData.skills.expert.cloud.map(s => sanitizeText(s)),
      infrastructure: profileData.skills.expert.infrastructure.map(s => sanitizeText(s)),
      aiMl: profileData.skills.expert.aiMl.map(s => sanitizeText(s))
    },
    education: {
      degree: sanitizeText(profileData.education.university.degree),
      institution: sanitizeText(profileData.education.university.institution),
      period: sanitizeText(profileData.education.university.period)
    },
    certifications: {
      cloud: sanitizeText(profileData.certifications.cloud[0]),
      engineering: sanitizeText(profileData.certifications.engineering[0])
    }
  };

  if (tailored) {
    const relevantSkills = analysis.match(/Skills:([^]*?)(?=Experience:|$)/)?.[1]?.trim() || '';
    const relevantExperience = analysis.match(/Experience:([^]*?)(?=Projects:|$)/)?.[1]?.trim() || '';
    
    return `
      <div style="margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 32px; color: #1a1a1a;">${sanitizedData.name}</h1>
        <p style="margin: 5px 0; font-size: 18px; color: #333;">Senior Full Stack Engineer | AI/ML Implementation Specialist</p>
        <div style="margin-top: 10px; font-size: 14px; color: #555;">
          <span>${sanitizedData.email}</span> | 
          <span>${sanitizedData.location}</span> | 
          <span>${sanitizedData.linkedin.replace('https://', '')}</span>
        </div>
      </div>

      <div style="margin-bottom: 25px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
        <h2 style="font-size: 18px; color: #1a1a1a; margin: 0 0 10px 0;">Tailored Summary for This Role</h2>
        <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0;">
          ${sanitizeText(analysis.split('\n')[0]) || sanitizedData.executiveSummary}
        </p>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Relevant Experience</h2>
        
        ${relevantExperience.includes('Northrop') || jobDescription.toLowerCase().includes('ai') || jobDescription.toLowerCase().includes('ml') ? `
        <div style="margin-top: 15px;">
          <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">${sanitizedData.northrop.role}</h3>
          <p style="margin: 2px 0; font-size: 14px; color: #555;">${sanitizedData.northrop.period}</p>
          <ul style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px; padding-left: 20px;">
            <li>Implementing ML-driven predictive maintenance with 85% accuracy</li>
            <li>Building RAG systems for technical documentation search</li>
            <li>Reducing deployment time from 2 weeks to 2 hours</li>
            <li>Prevented $300K+ in downtime through predictive analytics</li>
          </ul>
        </div>
        ` : ''}

        ${relevantExperience.includes('AmeriSave') || jobDescription.toLowerCase().includes('microservice') || jobDescription.toLowerCase().includes('scale') ? `
        <div style="margin-top: 20px;">
          <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">Software Architect @ AmeriSave Mortgage</h3>
          <p style="margin: 2px 0; font-size: 14px; color: #555;">Mar 2021 - Feb 2023</p>
          <ul style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px; padding-left: 20px;">
            <li>Orchestrated 500+ microservice ecosystem with GraphQL Federation</li>
            <li>Led database decomposition from 4000+ table monolith</li>
            <li>Reduced loan processing time by 50%</li>
            <li>Trained and mentored 60+ developers in modern practices</li>
          </ul>
        </div>
        ` : ''}
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Key Technical Skills for This Role</h2>
        <div style="margin-top: 10px; font-size: 14px; color: #333;">
          ${sanitizeText(relevantSkills) || `
          <p><strong>Primary:</strong> ${sanitizedData.skills.languages.slice(0, 3).join(', ')}, 
          ${sanitizedData.skills.frontend.slice(0, 2).join(', ')}, 
          ${sanitizedData.skills.backend.slice(0, 2).join(', ')}</p>
          <p style="margin-top: 5px;"><strong>Cloud & Infrastructure:</strong> ${sanitizedData.skills.cloud.join(', ')}</p>
          <p style="margin-top: 5px;"><strong>AI/ML:</strong> ${sanitizedData.skills.aiMl.join(', ')}</p>
          `}
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Education & Certifications</h2>
        <div style="margin-top: 10px;">
          <p style="font-size: 14px; color: #333;">
            <strong>${sanitizedData.education.degree}</strong><br/>
            ${sanitizedData.education.institution}
          </p>
          <p style="font-size: 14px; color: #333; margin-top: 10px;">
            <strong>Relevant Certifications:</strong> ${sanitizedData.certifications.cloud}
          </p>
        </div>
      </div>
    `;
  }

  // Standard resume
  return `
    <div style="margin-bottom: 30px;">
      <h1 style="margin: 0; font-size: 32px; color: #1a1a1a;">${sanitizedData.name}</h1>
      <p style="margin: 5px 0; font-size: 18px; color: #333;">Senior Full Stack Engineer</p>
      <div style="margin-top: 10px; font-size: 14px; color: #555;">
        <span>${sanitizedData.email}</span> | 
        <span>${sanitizedData.location}</span> | 
        <span>${sanitizedData.linkedin.replace('https://', '')}</span>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Executive Summary</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #333; margin-top: 10px;">
        ${sanitizedData.executiveSummary}
      </p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Experience</h2>
      
      <div style="margin-top: 15px;">
        <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">${sanitizedData.northrop.role}</h3>
        <p style="margin: 2px 0; font-size: 14px; color: #555;">${sanitizedData.northrop.period}</p>
        <p style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px;">
          ${sanitizedData.northrop.description}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Impact:</strong> ${sanitizedData.northrop.impact}
        </p>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">${sanitizedData.meridianVega.role}</h3>
        <p style="margin: 2px 0; font-size: 14px; color: #555;">${sanitizedData.meridianVega.period}</p>
        <p style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px;">
          ${sanitizedData.meridianVega.description}
        </p>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">Multiple Roles @ AmeriSave Mortgage Corporation</h3>
        <p style="margin: 2px 0; font-size: 14px; color: #555;">${sanitizedData.amerisave.period}</p>
        <p style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px;">
          Progressed from Full Stack Developer to Software Architect to Development Manager. 
          ${sanitizedData.amerisave.architectDescription}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Impact:</strong> ${sanitizedData.amerisave.architectImpact}
        </p>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Technical Skills</h2>
      <div style="margin-top: 10px;">
        <p style="font-size: 14px; color: #333;">
          <strong>Languages:</strong> ${sanitizedData.skills.languages.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Frontend:</strong> ${sanitizedData.skills.frontend.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Backend:</strong> ${sanitizedData.skills.backend.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Cloud & Infrastructure:</strong> ${sanitizedData.skills.cloud.join(', ')}, ${sanitizedData.skills.infrastructure.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>AI/ML:</strong> ${sanitizedData.skills.aiMl.join(', ')}
        </p>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Education & Certifications</h2>
      <div style="margin-top: 10px;">
        <p style="font-size: 14px; color: #333;">
          <strong>${sanitizedData.education.degree}</strong><br/>
          ${sanitizedData.education.institution} | ${sanitizedData.education.period}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 10px;">
          <strong>Certifications:</strong> ${sanitizedData.certifications.cloud}, 
          ${sanitizedData.certifications.engineering}
        </p>
      </div>
    </div>
  `;
};

export const generateStandardResume = async (profileData) => {
  // Create a temporary div to render the resume
  const resumeContainer = document.createElement('div');
  resumeContainer.style.position = 'absolute';
  resumeContainer.style.left = '-9999px';
  resumeContainer.style.width = '800px';
  resumeContainer.style.padding = '40px';
  resumeContainer.style.backgroundColor = 'white';
  resumeContainer.style.color = 'black';
  resumeContainer.style.fontFamily = 'Arial, sans-serif';
  
  // Use DOMPurify to sanitize the HTML
  const cleanHTML = DOMPurify.sanitize(createResumeHTML(profileData));
  resumeContainer.innerHTML = cleanHTML;
  
  document.body.appendChild(resumeContainer);
  
  try {
    const canvas = await html2canvas(resumeContainer, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    const sanitizedName = DOMPurify.sanitize(profileData.personal.name).replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`${sanitizedName}_Resume.pdf`);
  } catch (error) {
    throw error;
  } finally {
    document.body.removeChild(resumeContainer);
  }
};

export const generateTailoredResume = async (profileData, jobDescription, analysis) => {
  // Create a temporary div to render the tailored resume
  const resumeContainer = document.createElement('div');
  resumeContainer.style.position = 'absolute';
  resumeContainer.style.left = '-9999px';
  resumeContainer.style.width = '800px';
  resumeContainer.style.padding = '40px';
  resumeContainer.style.backgroundColor = 'white';
  resumeContainer.style.color = 'black';
  resumeContainer.style.fontFamily = 'Arial, sans-serif';
  
  // Use DOMPurify to sanitize the HTML
  const cleanHTML = DOMPurify.sanitize(createResumeHTML(profileData, true, jobDescription, analysis));
  resumeContainer.innerHTML = cleanHTML;
  
  document.body.appendChild(resumeContainer);
  
  try {
    const canvas = await html2canvas(resumeContainer, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    const sanitizedName = DOMPurify.sanitize(profileData.personal.name).replace(/[^a-zA-Z0-9]/g, '_');
    pdf.save(`${sanitizedName}_Tailored_Resume.pdf`);
  } catch (error) {
    throw error;
  } finally {
    document.body.removeChild(resumeContainer);
  }
};