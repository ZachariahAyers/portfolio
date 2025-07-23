import React from 'react';
import { X, Briefcase, Code, Award, Calendar, MapPin, ExternalLink, Github, Globe, Users, Zap, FileText, Download } from 'lucide-react';

const DetailedView = ({ mode, onClose, profileData, resumeType, resumeData, jobDescription, onDownloadPDF }) => {
  const renderMeView = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-xl">
          <img src={profileData.personal.avatarPath} alt={profileData.personal.name} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl font-bold text-white">{profileData.personal.name}</h1>
        <p className="text-xl text-gray-300">{profileData.personal.title}</p>
        <p className="text-lg text-blue-400 italic">"{profileData.personal.tagline}"</p>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Zap className="text-yellow-400" /> Executive Summary
        </h2>
        {profileData.personal.executiveSummary.map((summary, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed">{summary}</p>
        ))}
      </div>

      {/* What I Bring */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">What I Bring to Your Team</h2>
        <div className="grid gap-3">
          {profileData.personal.whatIBring.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">▸</span>
              <p className="text-gray-300">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why I Succeed */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Why I Succeed</h2>
        <div className="space-y-3">
          {profileData.whyISucceed.map((reason, idx) => (
            <p key={idx} className="text-gray-300 pl-4 border-l-2 border-blue-500">{reason}</p>
          ))}
        </div>
      </div>

      {/* Contact & Links */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Connect With Me</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href={`mailto:${profileData.contact.email}`} className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ExternalLink size={16} /> {profileData.contact.email}
          </a>
          <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <ExternalLink size={16} /> LinkedIn Profile
          </a>
          <a href={profileData.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <Github size={16} /> GitHub Portfolio
          </a>
          <a href={profileData.contact.calendly} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
            <Calendar size={16} /> Schedule a Call
          </a>
        </div>
      </div>
    </div>
  );

  const renderProjectsView = () => (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Featured Projects</h1>
      
      {Object.entries(profileData.projects).map(([key, project]) => (
        <div key={key} className="bg-gray-800/50 rounded-lg p-6 space-y-4 hover:bg-gray-800/70 transition-colors">
          <h2 className="text-2xl font-bold text-white">{project.name}</h2>
          <p className="text-gray-300">{project.description}</p>
          {project.impact && (
            <p className="text-green-400 font-semibold">Impact: {project.impact}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {project.url && (
              <a href={`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Globe size={16} /> {project.url}
              </a>
            )}
            {project.github && (
              <a href={`https://${project.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                <Github size={16} /> {project.github}
              </a>
            )}
          </div>
        </div>
      ))}

      {/* Current Projects */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Current Projects</h2>
        <div className="space-y-3">
          {profileData.additionalInfo.currentProjects.map((project, idx) => (
            <p key={idx} className="text-gray-300 pl-4 border-l-2 border-purple-500">{project}</p>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkillsView = () => (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white text-center mb-8">Technical Skills</h1>
      
      {/* Expert Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="text-yellow-400" /> Expert Level
        </h2>
        <p className="text-gray-400 italic">{profileData.skills.expert.description}</p>
        <div className="grid gap-4">
          {Object.entries(profileData.skills.expert).map(([category, skills]) => {
            if (category === 'description') return null;
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-blue-400 capitalize mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proficient Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Proficient</h2>
        <p className="text-gray-400 italic">{profileData.skills.proficient.description}</p>
        <div className="grid gap-4">
          {Object.entries(profileData.skills.proficient).map(([category, skills]) => {
            if (category === 'description') return null;
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-green-400 capitalize mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Familiar Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Familiar</h2>
        <p className="text-gray-400 italic">{profileData.skills.familiar.description}</p>
        <div className="grid gap-4">
          {Object.entries(profileData.skills.familiar).map(([category, skills]) => {
            if (category === 'description') return null;
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-orange-400 capitalize mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white">Certifications</h2>
        <div className="grid gap-4">
          {Object.entries(profileData.certifications).map(([category, certs]) => {
            if (category === 'inProgress') {
              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">In Progress</h3>
                  <div className="space-y-1">
                    {certs.map((cert, idx) => (
                      <p key={idx} className="text-gray-300 pl-4">• {cert}</p>
                    ))}
                  </div>
                </div>
              );
            }
            return (
              <div key={category}>
                <h3 className="text-lg font-semibold text-purple-400 capitalize mb-2">{category}</h3>
                <div className="space-y-1">
                  {certs.map((cert, idx) => (
                    <p key={idx} className="text-gray-300 pl-4">• {cert}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStandardResumeView = () => (
    <div className="space-y-8">
      {/* Resume Header */}
      <div className="text-center space-y-4 bg-gray-800/50 rounded-lg p-6">
        <h1 className="text-4xl font-bold text-white">{profileData.personal.name}</h1>
        <p className="text-xl text-gray-300">{profileData.personal.title}</p>
        <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
          <span>{profileData.contact.email}</span>
          <span>{profileData.contact.location}</span>
          <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
            LinkedIn Profile
          </a>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Executive Summary</h2>
        {profileData.personal.executiveSummary.map((summary, idx) => (
          <p key={idx} className="text-gray-300 leading-relaxed">{summary}</p>
        ))}
      </div>

      {/* Experience */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Experience</h2>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{profileData.experience.northrop.role}</h3>
          <p className="text-sm text-gray-400">{profileData.experience.northrop.period}</p>
          <p className="text-gray-300 leading-relaxed">{profileData.experience.northrop.description}</p>
          <p className="text-gray-300"><strong className="text-green-400">Impact:</strong> {profileData.experience.northrop.impact}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">{profileData.experience.meridianVega.role}</h3>
          <p className="text-sm text-gray-400">{profileData.experience.meridianVega.period}</p>
          <p className="text-gray-300 leading-relaxed">{profileData.experience.meridianVega.description}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Multiple Roles @ AmeriSave Mortgage Corporation</h3>
          <p className="text-sm text-gray-400">{profileData.experience.amerisave.period}</p>
          <p className="text-gray-300 leading-relaxed">
            Progressed from Full Stack Developer to Software Architect to Development Manager. 
            {profileData.experience.amerisave.architect.description}
          </p>
          <p className="text-gray-300"><strong className="text-green-400">Impact:</strong> {profileData.experience.amerisave.architect.impact}</p>
        </div>
      </div>

      {/* Technical Skills */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Technical Skills</h2>
        <div className="grid gap-3">
          <p className="text-gray-300">
            <strong className="text-blue-400">Languages:</strong> {profileData.skills.expert.languages.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">Frontend:</strong> {profileData.skills.expert.frontend.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">Backend:</strong> {profileData.skills.expert.backend.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">Cloud & Infrastructure:</strong> {profileData.skills.expert.cloud.join(', ')}, {profileData.skills.expert.infrastructure.join(', ')}
          </p>
          <p className="text-gray-300">
            <strong className="text-blue-400">AI/ML:</strong> {profileData.skills.expert.aiMl.join(', ')}
          </p>
        </div>
      </div>

      {/* Education & Certifications */}
      <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Education & Certifications</h2>
        <div className="space-y-3">
          <div>
            <p className="text-gray-300">
              <strong className="text-blue-400">{profileData.education.university.degree}</strong><br/>
              {profileData.education.university.institution} | {profileData.education.university.period}
            </p>
          </div>
          <div>
            <p className="text-gray-300">
              <strong className="text-blue-400">Certifications:</strong> {profileData.certifications.cloud[0]}, {profileData.certifications.engineering[0]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTailoredResumeView = () => {
    const analysis = resumeData?.analysis || '';
    const relevantSkills = analysis.match(/Skills:([^]*?)(?=Experience:|$)/)?.[1]?.trim() || '';
    const relevantExperience = analysis.match(/Experience:([^]*?)(?=Projects:|$)/)?.[1]?.trim() || '';
    
    return (
      <div className="space-y-8">
        {/* Resume Header */}
        <div className="text-center space-y-4 bg-gray-800/50 rounded-lg p-6">
          <h1 className="text-4xl font-bold text-white">{profileData.personal.name}</h1>
          <p className="text-xl text-gray-300">{profileData.personal.title} | AI/ML Implementation Specialist</p>
          <div className="flex justify-center items-center gap-6 text-sm text-gray-400">
            <span>{profileData.contact.email}</span>
            <span>{profileData.contact.location}</span>
            <a href={profileData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              LinkedIn Profile
            </a>
          </div>
        </div>

        {/* Tailored Summary */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-6 border border-blue-500/30">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="text-blue-400" />
            Tailored Summary for This Role
          </h2>
          <p className="text-gray-300 leading-relaxed">
            {analysis.split('\n')[0] || profileData.personal.executiveSummary[0]}
          </p>
        </div>

        {/* Relevant Experience */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Relevant Experience</h2>
          
          {(relevantExperience.includes('Northrop') || jobDescription.toLowerCase().includes('ai') || jobDescription.toLowerCase().includes('ml')) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{profileData.experience.northrop.role}</h3>
              <p className="text-sm text-gray-400">{profileData.experience.northrop.period}</p>
              <ul className="text-gray-300 space-y-2 pl-4">
                <li>• Implementing ML-driven predictive maintenance with 85% accuracy</li>
                <li>• Building RAG systems for technical documentation search</li>
                <li>• Reducing deployment time from 2 weeks to 2 hours</li>
                <li>• Prevented $300K+ in downtime through predictive analytics</li>
              </ul>
            </div>
          )}

          {(relevantExperience.includes('AmeriSave') || jobDescription.toLowerCase().includes('microservice') || jobDescription.toLowerCase().includes('scale')) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Software Architect @ AmeriSave Mortgage</h3>
              <p className="text-sm text-gray-400">Mar 2021 - Feb 2023</p>
              <ul className="text-gray-300 space-y-2 pl-4">
                <li>• Orchestrated 500+ microservice ecosystem with GraphQL Federation</li>
                <li>• Led database decomposition from 4000+ table monolith</li>
                <li>• Reduced loan processing time by 50%</li>
                <li>• Trained and mentored 60+ developers in modern practices</li>
              </ul>
            </div>
          )}
        </div>

        {/* Key Technical Skills for This Role */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Key Technical Skills for This Role</h2>
          {relevantSkills ? (
            <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: relevantSkills }} />
          ) : (
            <div className="grid gap-3">
              <p className="text-gray-300">
                <strong className="text-blue-400">Primary:</strong> {profileData.skills.expert.languages.slice(0, 3).join(', ')}, {profileData.skills.expert.frontend.slice(0, 2).join(', ')}, {profileData.skills.expert.backend.slice(0, 2).join(', ')}
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">Cloud & Infrastructure:</strong> {profileData.skills.expert.cloud.join(', ')}
              </p>
              <p className="text-gray-300">
                <strong className="text-blue-400">AI/ML:</strong> {profileData.skills.expert.aiMl.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Relevant Projects */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Relevant Projects</h2>
          <div className="space-y-3">
            {(jobDescription.toLowerCase().includes('ai') || jobDescription.toLowerCase().includes('ml')) && (
              <p className="text-gray-300">
                <strong className="text-blue-400">Production RAG Systems:</strong> Architected enterprise-scale retrieval-augmented generation for technical documentation
              </p>
            )}
            <p className="text-gray-300">
              <strong className="text-blue-400">AssembleJS:</strong> Created modern micro-frontend framework with islands architecture
            </p>
            {jobDescription.toLowerCase().includes('scale') && (
              <p className="text-gray-300">
                <strong className="text-blue-400">500+ Microservices Migration:</strong> Led transformation handling millions of daily transactions
              </p>
            )}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-white border-b-2 border-gray-600 pb-2">Education & Certifications</h2>
          <div className="space-y-3">
            <p className="text-gray-300">
              <strong className="text-blue-400">{profileData.education.university.degree}</strong><br/>
              {profileData.education.university.institution}
            </p>
            <p className="text-gray-300">
              <strong className="text-blue-400">Relevant Certifications:</strong> {profileData.certifications.cloud[0]}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (mode) {
      case 'me':
        return renderMeView();
      case 'projects':
        return renderProjectsView();
      case 'skills':
        return renderSkillsView();
      case 'resume-standard':
        return renderStandardResumeView();
      case 'resume-tailored':
        return renderTailoredResumeView();
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="sticky top-0 bg-gray-800 p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white capitalize flex items-center gap-2">
            {mode === 'resume-standard' && (
              <>
                <FileText className="h-6 w-6 text-blue-400" />
                Standard Resume
              </>
            )}
            {mode === 'resume-tailored' && (
              <>
                <FileText className="h-6 w-6 text-purple-400" />
                Tailored Resume
              </>
            )}
            {!mode.startsWith('resume') && mode}
          </h2>
          <div className="flex items-center gap-3">
            {(mode === 'resume-standard' || mode === 'resume-tailored') && onDownloadPDF && (
              <button
                onClick={onDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 active:scale-95 flex items-center gap-2"
              >
                <Download size={16} />
                Download PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="h-6 w-6 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DetailedView;