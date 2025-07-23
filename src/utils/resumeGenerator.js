import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  if (dateStr.includes('Present')) return dateStr;
  
  const parts = dateStr.split(' - ');
  return parts.join(' - ');
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
  
  resumeContainer.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="margin: 0; font-size: 32px; color: #1a1a1a;">${profileData.name}</h1>
      <p style="margin: 5px 0; font-size: 18px; color: #333;">Senior Full Stack Engineer</p>
      <div style="margin-top: 10px; font-size: 14px; color: #555;">
        <span>${profileData.contact.email}</span> | 
        <span>${profileData.contact.location}</span> | 
        <span>${profileData.contact.linkedin.replace('https://', '')}</span>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Executive Summary</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #333; margin-top: 10px;">
        ${profileData.executiveSummary.join(' ')}
      </p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Experience</h2>
      
      <div style="margin-top: 15px;">
        <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">${profileData.experience.northrop.role}</h3>
        <p style="margin: 2px 0; font-size: 14px; color: #555;">${profileData.experience.northrop.period}</p>
        <p style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px;">
          ${profileData.experience.northrop.description}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Impact:</strong> ${profileData.experience.northrop.impact}
        </p>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">${profileData.experience.meridianVega.role}</h3>
        <p style="margin: 2px 0; font-size: 14px; color: #555;">${profileData.experience.meridianVega.period}</p>
        <p style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px;">
          ${profileData.experience.meridianVega.description}
        </p>
      </div>

      <div style="margin-top: 20px;">
        <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">Multiple Roles @ AmeriSave Mortgage Corporation</h3>
        <p style="margin: 2px 0; font-size: 14px; color: #555;">${profileData.experience.amerisave.period}</p>
        <p style="font-size: 14px; line-height: 1.5; color: #333; margin-top: 8px;">
          Progressed from Full Stack Developer to Software Architect to Development Manager. 
          ${profileData.experience.amerisave.architect.description}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Impact:</strong> ${profileData.experience.amerisave.architect.impact}
        </p>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Technical Skills</h2>
      <div style="margin-top: 10px;">
        <p style="font-size: 14px; color: #333;">
          <strong>Languages:</strong> ${profileData.skills.expert.languages.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Frontend:</strong> ${profileData.skills.expert.frontend.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Backend:</strong> ${profileData.skills.expert.backend.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>Cloud & Infrastructure:</strong> ${profileData.skills.expert.cloud.join(', ')}, ${profileData.skills.expert.infrastructure.join(', ')}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 5px;">
          <strong>AI/ML:</strong> ${profileData.skills.expert.aiMl.join(', ')}
        </p>
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Education & Certifications</h2>
      <div style="margin-top: 10px;">
        <p style="font-size: 14px; color: #333;">
          <strong>${profileData.education.university.degree}</strong><br/>
          ${profileData.education.university.institution} | ${profileData.education.university.period}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 10px;">
          <strong>Certifications:</strong> ${profileData.certifications.cloud[0]}, 
          ${profileData.certifications.engineering[0]}
        </p>
      </div>
    </div>
  `;
  
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
    pdf.save(`${profileData.name.replace(' ', '_')}_Resume.pdf`);
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
  
  // Extract key points from the AI analysis
  const relevantSkills = analysis.match(/Skills:([^]*?)(?=Experience:|$)/)?.[1]?.trim() || '';
  const relevantExperience = analysis.match(/Experience:([^]*?)(?=Projects:|$)/)?.[1]?.trim() || '';
  
  resumeContainer.innerHTML = `
    <div style="margin-bottom: 30px;">
      <h1 style="margin: 0; font-size: 32px; color: #1a1a1a;">${profileData.name}</h1>
      <p style="margin: 5px 0; font-size: 18px; color: #333;">Senior Full Stack Engineer | AI/ML Implementation Specialist</p>
      <div style="margin-top: 10px; font-size: 14px; color: #555;">
        <span>${profileData.contact.email}</span> | 
        <span>${profileData.contact.location}</span> | 
        <span>${profileData.contact.linkedin.replace('https://', '')}</span>
      </div>
    </div>

    <div style="margin-bottom: 25px; background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
      <h2 style="font-size: 18px; color: #1a1a1a; margin: 0 0 10px 0;">Tailored Summary for This Role</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #333; margin: 0;">
        ${analysis.split('\n')[0] || profileData.executiveSummary[0]}
      </p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Relevant Experience</h2>
      
      ${relevantExperience.includes('Northrop') || jobDescription.toLowerCase().includes('ai') || jobDescription.toLowerCase().includes('ml') ? `
      <div style="margin-top: 15px;">
        <h3 style="font-size: 16px; margin: 0; color: #1a1a1a;">${profileData.experience.northrop.role}</h3>
        <p style="margin: 2px 0; font-size: 14px; color: #555;">${profileData.experience.northrop.period}</p>
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
        ${relevantSkills || `
        <p><strong>Primary:</strong> ${profileData.skills.expert.languages.slice(0, 3).join(', ')}, 
        ${profileData.skills.expert.frontend.slice(0, 2).join(', ')}, 
        ${profileData.skills.expert.backend.slice(0, 2).join(', ')}</p>
        <p style="margin-top: 5px;"><strong>Cloud & Infrastructure:</strong> ${profileData.skills.expert.cloud.join(', ')}</p>
        <p style="margin-top: 5px;"><strong>AI/ML:</strong> ${profileData.skills.expert.aiMl.join(', ')}</p>
        `}
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Relevant Projects</h2>
      <div style="margin-top: 10px;">
        ${jobDescription.toLowerCase().includes('ai') || jobDescription.toLowerCase().includes('ml') ? `
        <p style="font-size: 14px; color: #333; margin-bottom: 10px;">
          <strong>Production RAG Systems:</strong> Architected enterprise-scale retrieval-augmented generation for technical documentation
        </p>
        ` : ''}
        <p style="font-size: 14px; color: #333; margin-bottom: 10px;">
          <strong>AssembleJS:</strong> Created modern micro-frontend framework with islands architecture
        </p>
        ${jobDescription.toLowerCase().includes('scale') ? `
        <p style="font-size: 14px; color: #333;">
          <strong>500+ Microservices Migration:</strong> Led transformation handling millions of daily transactions
        </p>
        ` : ''}
      </div>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 5px;">Education & Certifications</h2>
      <div style="margin-top: 10px;">
        <p style="font-size: 14px; color: #333;">
          <strong>${profileData.education.university.degree}</strong><br/>
          ${profileData.education.university.institution}
        </p>
        <p style="font-size: 14px; color: #333; margin-top: 10px;">
          <strong>Relevant Certifications:</strong> ${profileData.certifications.cloud[0]}
        </p>
      </div>
    </div>
  `;
  
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
    pdf.save(`${profileData.name.replace(' ', '_')}_Tailored_Resume.pdf`);
  } finally {
    document.body.removeChild(resumeContainer);
  }
};