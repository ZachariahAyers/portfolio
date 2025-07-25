import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Code, Package, ExternalLink, Quote } from 'lucide-react';

const CaseStudyContent = ({ sections, technologies, links, testimonials, onSectionChange }) => {
  const sectionRefs = useRef({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onSectionChange(entry.target.dataset.section);
        }
      });
    }, observerOptions);

    // Observe all sections
    Object.keys(sections).forEach(key => {
      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]);
      }
    });

    return () => observer.disconnect();
  }, [sections, onSectionChange]);

  const renderSection = (key, content) => {
    return (
      <section
        key={key}
        ref={el => sectionRefs.current[key] = el}
        data-section={key}
        className="mb-12 scroll-mt-24"
        id={key}
      >
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
              p: ({node, ...props}) => <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300" {...props} />,
              li: ({node, ...props}) => <li className="ml-4" {...props} />,
              strong: ({node, ...props}) => <strong className="font-semibold text-gray-900 dark:text-white" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg" {...props} />
              ),
              code: ({node, inline, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline ? (
                  <div className="relative group my-6">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-bl-lg rounded-tr-lg">
                      {match ? match[1] : 'code'}
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <code className={className} {...props}>
                        {children}
                      </code>
                    </pre>
                  </div>
                ) : (
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </section>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
      {/* Executive Summary */}
      {sections.executive && renderSection('executive', sections.executive)}

      {/* Main Content Sections */}
      {Object.entries(sections).map(([key, content]) => {
        if (key !== 'executive') {
          return renderSection(key, content);
        }
        return null;
      })}

      {/* Technologies Section */}
      {technologies && technologies.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Package className="text-blue-500" />
            Technologies Used
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {technologies.map((tech, index) => (
              <div 
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tech}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Quote className="text-purple-500" />
            What People Say
          </h2>
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800"
              >
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  {testimonial.image && (
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links Section */}
      {links && Object.keys(links).length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <ExternalLink className="text-green-500" />
            External Resources
          </h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                <ExternalLink size={16} />
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CaseStudyContent;