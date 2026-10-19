import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import { 
  FileText, Folder, FolderOpen, X, Minus, Square,
  Code2, Database, Cloud, GitBranch, Package, Globe,
  Server, Terminal, Cpu, Settings, ExternalLink,
  Palette, CircuitBoard, Regex, Activity, NotebookPen, Monitor,
  Satellite, Sparkles, Atom, Zap, Binary, Radio, Power,
  Gamepad2, Grid3x3, AlertTriangle
} from 'lucide-react';

// Windows 98 Boot Screen
const BootScreen = ({ onBootComplete, projectName }) => {
  const [progress, setProgress] = useState(0);
  const [booting, setBooting] = useState(true);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBooting(false);
            setTimeout(onBootComplete, 500);
          }, 500);
          return 100;
        }
        const next = prev + Math.random() * 15;
        return next > 100 ? 100 : next;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [onBootComplete]);
  
  if (!booting) return null;
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#008080] dark:bg-black flex items-center justify-center z-50"
    >
      <div className="text-center">
        <div className="mb-8">
          <div className="text-white dark:text-green-400 font-bold text-4xl mb-2 font-['Arial']">
            CodeOS 98
          </div>
          <div className="text-white dark:text-green-400 text-sm">
            Professional Stack Edition™
          </div>
        </div>
        
        <div className="w-80 h-6 bg-gray-800 dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-700">
          <motion.div
            className="h-full bg-linear-to-r from-blue-600 to-blue-400 dark:from-green-600 dark:to-green-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
          />
        </div>
        
        <div className="text-white dark:text-green-400 text-xs mt-4">
          Opening Tech Stack for {projectName}...
        </div>
      </div>
    </motion.div>
  );
};

// Blue Screen of Death Component
const BlueScreenOfDeath = ({ onRestart }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-[#0000AA] text-white font-['Courier_New'] z-10000 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-5xl w-full text-center">
        <div className="bg-[#A8A8A8] text-[#0000AA] inline-block px-3 md:px-6 py-1 md:py-2 mb-4 md:mb-8 text-sm md:text-xl font-bold">
          &nbsp;Windows&nbsp;
        </div>
        
        <div className={`text-left space-y-2 md:space-y-6 ${isMobile ? 'text-xs' : 'text-xl'} leading-relaxed`}>
          <p className={isMobile ? '' : 'whitespace-nowrap'}>A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36.</p>
          <p className={isMobile ? '' : 'whitespace-nowrap'}>The current application will be terminated.</p>
          <br className="hidden md:block" />
          <p className={isMobile ? '' : 'whitespace-nowrap'}>*  Press any key to terminate the current application.</p>
          <p className={isMobile ? '' : 'whitespace-nowrap'}>*  Press CTRL+ALT+DEL again to restart your computer.</p>
          <p className={isMobile ? '' : 'whitespace-nowrap'}>   You will lose any unsaved information in all applications.</p>
          <br className="hidden md:block" />
          <p className={`text-center ${isMobile ? 'text-base' : 'text-2xl'} mt-4`}>Press any key to continue _</p>
        </div>
        
        <div className={`mt-8 md:mt-20 ${isMobile ? 'text-xs' : 'text-base'} opacity-75`}>
          <p className={isMobile ? '' : 'whitespace-nowrap'}>KERNEL32.DLL at 0137:BFF93780</p>
          <p className={isMobile ? '' : 'whitespace-nowrap'}>TECH_STACK_ANALYZER.EXE caused an exception in module DELETED_WIN_32.DLL</p>
          <p className={isMobile ? '' : 'whitespace-nowrap'}>Exception: 0xC0DE0S98 (Too Much Nostalgia)</p>
        </div>
        
        <button 
          onClick={onRestart}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Click to restart"
        />
      </div>
    </div>
  );
};

// Draggable and resizable window component
const Window98 = ({ title, children, onClose, onMinimize, defaultPosition = { x: 50, y: 50 }, zIndex, onFocus, icon: Icon = FileText, isMinimized = false }) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 800, height: 600 });
  const [maximized, setMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState(null);
  const [previousPosition, setPreviousPosition] = useState(null);
  const windowRef = useRef(null);
  const isDark = document.documentElement.classList.contains('dark');
  
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    onFocus();
  };
  
  const handleResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !maximized) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      } else if (isResizing && !maximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        setSize({
          width: Math.max(400, resizeStart.width + deltaX),
          height: Math.max(300, resizeStart.height + deltaY)
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, maximized]);
  
  if (isMinimized) return null;

  return (
    <div
      ref={windowRef}
      className={`absolute ${maximized ? 'inset-0' : ''} flex flex-col`}
      style={{ 
        ...(maximized ? {} : { 
          left: position.x, 
          top: position.y,
          width: size.width,
          height: size.height
        }),
        zIndex 
      }}
    >
      {/* Window Border */}
      <div className={`
        flex-1 flex flex-col
        ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
        border-2
        ${isDark ? 'border-gray-600' : 'border-[#dfdfdf]'}
        ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
        ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
      `}>
        {/* Title Bar */}
        <div 
          className={`
            h-8 px-1 flex items-center justify-between cursor-move select-none
            ${isDark ? 'bg-linear-to-r from-gray-700 to-gray-600' : 'bg-linear-to-r from-[#000080] to-[#1084d0]'}
          `}
          onMouseDown={handleMouseDown}
          onDoubleClick={() => {
            if (maximized) {
              setMaximized(false);
              if (previousSize) setSize(previousSize);
              if (previousPosition) setPosition(previousPosition);
            } else {
              setPreviousSize(size);
              setPreviousPosition(position);
              setMaximized(true);
            }
          }}
        >
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-bold">{title}</span>
          </div>
          
          <div className="flex gap-1 window-controls">
            <button
              onClick={onMinimize}
              className={`
                w-6 h-6 flex items-center justify-center
                ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                border
                ${isDark ? 'border-t-gray-500 border-l-gray-500' : 'border-t-white border-l-white'}
                ${isDark ? 'border-r-gray-900 border-b-gray-900' : 'border-r-black border-b-black'}
              `}
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                if (maximized) {
                  setMaximized(false);
                  if (previousSize) setSize(previousSize);
                  if (previousPosition) setPosition(previousPosition);
                } else {
                  setPreviousSize(size);
                  setPreviousPosition(position);
                  setMaximized(true);
                }
              }}
              className={`
                w-6 h-6 flex items-center justify-center
                ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                border
                ${isDark ? 'border-t-gray-500 border-l-gray-500' : 'border-t-white border-l-white'}
                ${isDark ? 'border-r-gray-900 border-b-gray-900' : 'border-r-black border-b-black'}
              `}
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={onClose}
              className={`
                w-6 h-6 flex items-center justify-center
                ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                border
                ${isDark ? 'border-t-gray-500 border-l-gray-500' : 'border-t-white border-l-white'}
                ${isDark ? 'border-r-gray-900 border-b-gray-900' : 'border-r-black border-b-black'}
              `}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
        
        {/* Window Content */}
        <div className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'} m-1 overflow-auto`}>
          {children}
        </div>
        
        {/* Resize Handle */}
        {!maximized && (
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 cursor-se-resize ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}`}
            onMouseDown={handleResize}
            style={{
              borderRight: `2px solid ${isDark ? '#1f2937' : '#808080'}`,
              borderBottom: `2px solid ${isDark ? '#1f2937' : '#808080'}`,
              borderLeft: `2px solid ${isDark ? '#6b7280' : '#c0c0c0'}`,
              borderTop: `2px solid ${isDark ? '#6b7280' : '#c0c0c0'}`
            }}
          />
        )}
      </div>
    </div>
  );
};

// VSCode-like interface
// Syntax highlighting helper
const highlightCode = (code, language) => {
  // Simple syntax highlighting for demonstration
  let highlighted = code;
  
  // Keywords
  const keywords = {
    js: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|super|extends|static|get|set)\b/g,
    python: /\b(def|class|import|from|return|if|else|elif|for|while|in|try|except|finally|with|as|raise|async|await|lambda|pass|break|continue)\b/g,
    sql: /\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|ON|AS|WITH|GROUP BY|ORDER BY|HAVING|LIMIT|OFFSET|CREATE|TABLE|INSERT|UPDATE|DELETE|ALTER|DROP|INDEX|VIEW|TRIGGER|FUNCTION|PROCEDURE|BEGIN|END|COMMIT|ROLLBACK|UNION|DISTINCT|COUNT|SUM|AVG|MAX|MIN|CASE|WHEN|THEN|ELSE|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|NULL)\b/gi,
    yaml: /\b(true|false|null|yes|no)\b/g,
    dockerfile: /\b(FROM|RUN|CMD|ENTRYPOINT|COPY|WORKDIR|EXPOSE|ENV|ARG|USER|VOLUME|LABEL|MAINTAINER|ADD|HEALTHCHECK)\b/g,
    hcl: /\b(provider|resource|module|variable|output|locals|data|terraform|required_version|required_providers|source|version|region|name|cidr|azs|private_subnets|public_subnets|enable_nat_gateway|enable_vpn_gateway|tags)\b/g,
    groovy: /\b(def|class|import|return|if|else|for|while|in|try|catch|finally|throw|new|this|pipeline|agent|stages|stage|steps|parallel|when|post|always|success|failure|container|sh|script|echo|env)\b/g
  };
  
  // Strings
  const stringPatterns = {
    js: /(['"`])(?:(?=(\\?))\2[\s\S])*?\1/g,
    python: /(['"])(?:(?=(\\?))\2[\s\S])*?\1|"""[\s\S]*?"""|'''[\s\S]*?'''/g,
    sql: /(['])(?:(?=(\\?))\2[\s\S])*?\1/g,
    yaml: /(['"])(?:(?=(\\?))\2[\s\S])*?\1/g,
    dockerfile: /(['"])(?:(?=(\\?))\2[\s\S])*?\1/g,
    hcl: /(['"])(?:(?=(\\?))\2[\s\S])*?\1/g,
    groovy: /(['"])(?:(?=(\\?))\2[\s\S])*?\1|"""[\s\S]*?"""/g
  };
  
  // Comments
  const commentPatterns = {
    js: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm,
    python: /(#.*$)/gm,
    sql: /(--.*$|\/\*[\s\S]*?\*\/)/gm,
    yaml: /(#.*$)/gm,
    dockerfile: /(#.*$)/gm,
    hcl: /(\/\/.*$|\/\*[\s\S]*?\*\/)|(#.*$)/gm,
    groovy: /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
  };
  
  // Numbers
  const numberPattern = /\b(\d+\.?\d*)\b/g;
  
  // Functions/Methods
  const functionPatterns = {
    js: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    python: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g,
    groovy: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g
  };
  
  // Determine language type
  let lang = 'js';
  if (language.includes('.py')) lang = 'python';
  else if (language.includes('.sql')) lang = 'sql';
  else if (language.includes('.yaml') || language.includes('.yml')) lang = 'yaml';
  else if (language.includes('.dockerfile') || language.includes('Docker')) lang = 'dockerfile';
  else if (language.includes('.tf')) lang = 'hcl';
  else if (language.includes('.groovy')) lang = 'groovy';
  else if (language.includes('.css')) lang = 'css';
  
  // Apply highlighting in specific order to avoid conflicts
  // First, escape HTML
  highlighted = highlighted.replace(/[<>]/g, match => match === '<' ? '&lt;' : '&gt;');
  
  // Comments (do this before strings to handle comment chars in strings)
  if (commentPatterns[lang]) {
    highlighted = highlighted.replace(commentPatterns[lang], '<span class="syntax-comment">$&</span>');
  }
  
  // Strings
  if (stringPatterns[lang]) {
    highlighted = highlighted.replace(stringPatterns[lang], '<span class="syntax-string">$&</span>');
  }
  
  // Keywords
  if (keywords[lang]) {
    highlighted = highlighted.replace(keywords[lang], '<span class="syntax-keyword">$&</span>');
  }
  
  // Numbers
  highlighted = highlighted.replace(numberPattern, '<span class="syntax-number">$&</span>');
  
  // Functions
  if (functionPatterns[lang]) {
    highlighted = highlighted.replace(functionPatterns[lang], '<span class="syntax-function">$1</span>(');
  }
  
  // CSS specific
  if (lang === 'css') {
    // CSS selectors
    highlighted = highlighted.replace(/([.#@][a-zA-Z0-9-_]+)/g, '<span class="syntax-selector">$1</span>');
    // CSS properties
    highlighted = highlighted.replace(/([a-zA-Z-]+)\s*:/g, '<span class="syntax-property">$1</span>:');
  }
  
  return highlighted;
};

const VSCodeInterface = ({ fileStructure }) => {
  const [openFolders, setOpenFolders] = useState(['frontend', 'backend', 'infrastructure', 'devops']);
  const [activeFile, setActiveFile] = useState(null);
  const [openTabs, setOpenTabs] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = document.documentElement.classList.contains('dark');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Use provided fileStructure or fall back to default
  const defaultFileStructure = {
    frontend: [
      { name: 'React.tsx', icon: '⚛️', tech: 'React', code: `import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Component mounted with count:', count);
  }, [count]);
  
  return (
    <div className="app">
      <h1>React 18 with TypeScript</h1>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
};` },
      { name: 'Vue.js', icon: '💚', tech: 'Vue', code: `<template>
  <div class="app">
    <h1>{{ title }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const count = ref(0);
const title = computed(() => \`Vue 3 Composition API\`);

const increment = () => {
  count.value++;
};
</script>` },
      { name: 'TailwindCSS.css', icon: '🎨', tech: 'Tailwind CSS', code: `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded-lg
           hover:bg-blue-600 transition-colors duration-200
           focus:outline-hidden focus:ring-2 focus:ring-blue-500;
  }
  
  .card {
    @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg
           p-6 border border-gray-200 dark:border-gray-700;
  }
}` }
    ],
    backend: [
      { name: 'Node.js', icon: '🟢', tech: 'Node.js', code: `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'operational',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});` },
      { name: 'Python.py', icon: '🐍', tech: 'Python', code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import asyncio

app = FastAPI(title="Tech Stack API")

class Technology(BaseModel):
    name: str
    category: str
    proficiency: int
    years_experience: float

@app.get("/api/technologies")
async def get_technologies() -> List[Technology]:
    return [
        Technology(name="Python", category="backend", proficiency=95, years_experience=8),
        Technology(name="FastAPI", category="backend", proficiency=90, years_experience=3)
    ]

@app.post("/api/analyze")
async def analyze_code(code: str) -> dict:
    # Simulate async processing
    await asyncio.sleep(0.1)
    return {"complexity": "moderate", "suggestions": ["Add type hints"]}` },
      { name: 'PostgreSQL.sql', icon: '🐘', tech: 'PostgreSQL', code: `-- Advanced PostgreSQL with CTEs and Window Functions
WITH user_metrics AS (
  SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT p.id) as post_count,
    COUNT(DISTINCT c.id) as comment_count,
    AVG(p.score) as avg_post_score
  FROM users u
  LEFT JOIN posts p ON u.id = p.user_id
  LEFT JOIN comments c ON u.id = c.user_id
  WHERE u.created_at >= NOW() - INTERVAL '1 year'
  GROUP BY u.id, u.username
),
ranked_users AS (
  SELECT 
    *,
    ROW_NUMBER() OVER (ORDER BY avg_post_score DESC) as score_rank,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY post_count) OVER () as median_posts
  FROM user_metrics
)
SELECT * FROM ranked_users WHERE score_rank <= 10;` }
    ],
    infrastructure: [
      { name: 'Docker.dockerfile', icon: '🐳', tech: 'Docker', code: `# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

RUN apk add --no-cache tini
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
USER node

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]` },
      { name: 'Kubernetes.yaml', icon: '☸️', tech: 'Kubernetes', code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: tech-stack-api
  namespace: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: tech-stack-api
  template:
    metadata:
      labels:
        app: tech-stack-api
    spec:
      containers:
      - name: api
        image: techstack/api:latest
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          periodSeconds: 10` },
      { name: 'Terraform.tf', icon: '🏗️', tech: 'Terraform', code: `provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"
  
  name = "tech-stack-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b", "us-east-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = true
  
  tags = {
    Environment = "production"
    Terraform   = "true"
  }
}` }
    ],
    devops: [
      { name: 'GitHubActions.yml', icon: '🚀', tech: 'GitHub Actions', code: `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'
    
    - run: npm ci
    - run: npm run lint
    - run: npm test -- --coverage
    - run: npm run build
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      if: matrix.node-version == '18.x'` },
      { name: 'Jenkins.groovy', icon: '🔨', tech: 'Jenkins', code: `pipeline {
    agent {
        kubernetes {
            yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18
    tty: true
  - name: docker
    image: docker:dind
    tty: true
    volumeMounts:
    - name: docker-sock
      mountPath: /var/run/docker.sock
"""
        }
    }
    
    stages {
        stage('Build') {
            steps {
                container('node') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        container('node') {
                            sh 'npm test'
                        }
                    }
                }
                stage('Lint') {
                    steps {
                        container('node') {
                            sh 'npm run lint'
                        }
                    }
                }
            }
        }
    }
}` }
    ]
  };
  
  // Use provided fileStructure or default
  const files = fileStructure || defaultFileStructure;
  
  const toggleFolder = (folder) => {
    setOpenFolders(prev => 
      prev.includes(folder) 
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };
  
  const openFile = (category, file) => {
    const fileId = `${category}/${file.name}`;
    if (!openTabs.find(tab => tab.id === fileId)) {
      setOpenTabs(prev => [...prev, { id: fileId, ...file, category }]);
    }
    setActiveFile(fileId);
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };
  
  const closeTab = (tabId, e) => {
    e.stopPropagation();
    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeFile === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveFile(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  };
  
  const activeTab = openTabs.find(tab => tab.id === activeFile);
  
  return (
    <div className="flex h-full relative">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`absolute top-2 left-2 z-50 p-2 rounded-sm ${isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          >
            <Folder className="w-5 h-5" />
          </button>
          
          {/* Mobile Overlay */}
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-30 md:hidden" 
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </>
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'absolute inset-y-0 left-0 z-40 transform transition-transform' : 'relative'}
        ${isMobile && !mobileMenuOpen ? '-translate-x-full' : 'translate-x-0'}
        w-64 ${isDark ? 'bg-gray-800' : 'bg-[#f3f3f3]'} border-r ${isDark ? 'border-gray-700' : 'border-gray-300'} overflow-y-auto dashboard-scroll
      `}>
        <div className={`p-2 text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          EXPLORER
        </div>
        <div className="px-2">
          {Object.entries(files).map(([category, categoryFiles]) => (
            <div key={category} className="mb-1">
              <div
                className={`flex items-center gap-1 py-1 cursor-pointer hover:${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                onClick={() => toggleFolder(category)}
              >
                {openFolders.includes(category) ? 
                  <FolderOpen className="w-4 h-4 text-yellow-600" /> : 
                  <Folder className="w-4 h-4 text-yellow-600" />
                }
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {category}
                </span>
              </div>
              {openFolders.includes(category) && (
                <div className="ml-4">
                  {categoryFiles.map(file => (
                    <div
                      key={file.name}
                      className={`
                        flex items-center gap-2 py-1 px-2 cursor-pointer text-sm
                        ${activeFile === `${category}/${file.name}` ? 
                          (isDark ? 'bg-gray-700' : 'bg-gray-300') : 
                          `hover:${isDark ? 'bg-gray-700' : 'bg-gray-200'}`
                        }
                      `}
                      onClick={() => openFile(category, file)}
                    >
                      <span>{file.icon}</span>
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                        {file.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className={`flex ${isMobile ? 'overflow-x-auto' : ''} ${isDark ? 'bg-gray-800' : 'bg-[#f3f3f3]'} border-b ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
          {openTabs.map(tab => (
            <div
              key={tab.id}
              className={`
                flex items-center gap-2 px-3 py-2 cursor-pointer border-r
                ${isDark ? 'border-gray-700' : 'border-gray-300'}
                ${activeFile === tab.id ? 
                  (isDark ? 'bg-gray-900 text-white' : 'bg-white text-black') : 
                  (isDark ? 'bg-gray-800 text-gray-400' : 'bg-[#f3f3f3] text-gray-600')
                }
              `}
              onClick={() => setActiveFile(tab.id)}
            >
              <span>{tab.icon}</span>
              <span className="text-sm">{tab.name}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className={`ml-2 ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'} rounded-sm`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Code Editor */}
        <div className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'} p-4 overflow-auto dashboard-scroll`}>
          {activeTab ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {activeTab.tech}
                </h3>
                <a
                  href={(() => {
                    // Map tech names to correct DevDocs URLs or official docs
                    const docUrls = {
                      'React': 'https://devdocs.io/react/',
                      'Vue': 'https://devdocs.io/vue~3/',
                      'Tailwind CSS': 'https://tailwindcss.com/docs',
                      'Node.js': 'https://devdocs.io/node/',
                      'Python': 'https://devdocs.io/python~3.11/',
                      'PostgreSQL': 'https://devdocs.io/postgresql~15/',
                      'Docker': 'https://devdocs.io/docker/',
                      'Kubernetes': 'https://kubernetes.io/docs/',
                      'Terraform': 'https://developer.hashicorp.com/terraform/docs',
                      'GitHub Actions': 'https://docs.github.com/en/actions',
                      'Jenkins': 'https://www.jenkins.io/doc/'
                    };
                    return docUrls[activeTab.tech] || `https://devdocs.io/`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    inline-flex items-center gap-2 px-3 py-1 text-sm
                    ${isDark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                    rounded
                  `}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Documentation
                </a>
              </div>
              <pre className={`text-sm font-mono ${isDark ? 'text-gray-300' : 'text-gray-800'} whitespace-pre-wrap`}>
                <code dangerouslySetInnerHTML={{ __html: highlightCode(activeTab.code, activeTab.name) }} />
              </pre>
            </div>
          ) : (
            <div className={`flex items-center justify-center h-full ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>Select a file to view code</p>
            </div>
          )}
        </div>
        
        {/* Status Bar */}
        <div className={`
          h-6 px-4 flex items-center justify-between text-xs
          ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-[#f3f3f3] text-gray-600'}
        `}>
          <span>UTF-8</span>
          <span>{activeTab ? `${activeTab.category}/${activeTab.name}` : 'No file open'}</span>
          <span>Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  );
};

// Notepad Component
const Notepad = () => {
  const isDark = document.documentElement.classList.contains('dark');
  const [text, setText] = useState(`// Welcome to Notepad 98!
// This is where you can take notes about the tech stack

Tech Stack Summary:
==================
Frontend: React, Vue, Tailwind CSS
Backend: Node.js, Python, PostgreSQL
DevOps: Docker, Kubernetes, GitHub Actions

Notes:
- All services running smoothly
- Latest deployment successful
- Performance metrics looking good`);
  
  return (
    <div className="h-full flex flex-col">
      <div className={`flex gap-4 p-2 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
        <button className="text-xs hover:underline">File</button>
        <button className="text-xs hover:underline">Edit</button>
        <button className="text-xs hover:underline">Format</button>
        <button className="text-xs hover:underline">View</button>
        <button className="text-xs hover:underline">Help</button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={`flex-1 p-4 font-mono text-sm resize-none outline-hidden ${
          isDark ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-800'
        }`}
        spellCheck={false}
      />
      <div className={`h-6 px-2 flex items-center text-xs ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <span>Ln 1, Col 1</span>
        <span className="ml-auto">UTF-8</span>
      </div>
    </div>
  );
};

// Loading component for iframes
const IframeLoader = ({ src, title }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const isDark = document.documentElement.classList.contains('dark');
  
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev; // Stop at 90% until actually loaded
          return prev + Math.random() * 15;
        });
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [loading]);
  
  const segments = 20;
  const filledSegments = Math.floor((progress / 100) * segments);
  
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className={`absolute inset-0 ${isDark ? 'bg-gray-900' : 'bg-[#c0c0c0]'} flex items-center justify-center z-10`}>
          <div className={`
            ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
            border-2
            ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
            ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
            p-6
          `}>
            <div className={`text-sm font-bold mb-4 ${isDark ? 'text-gray-200' : 'text-black'}`}>
              Loading {title}...
            </div>
            
            {/* Windows 98 style progress bar */}
            <div className={`
              w-64 h-6 p-1
              ${isDark ? 'bg-gray-900' : 'bg-white'}
              border-2
              ${isDark ? 'border-t-black border-l-black' : 'border-t-gray-800 border-l-gray-800'}
              ${isDark ? 'border-r-gray-600 border-b-gray-600' : 'border-r-white border-b-white'}
            `}>
              <div className="flex gap-0.5 h-full">
                {Array.from({ length: segments }).map((_, i) => (
                  <div
                    key={i}
                    className={`
                      flex-1 h-full
                      ${i < filledSegments 
                        ? (isDark ? 'bg-green-500' : 'bg-[#000080]') 
                        : (isDark ? 'bg-gray-800' : 'bg-gray-200')
                      }
                    `}
                  />
                ))}
              </div>
            </div>
            
            <div className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {Math.round(progress)}% complete
            </div>
          </div>
        </div>
      )}
      <iframe
        src={src}
        className="w-full h-full"
        title={title}
        onLoad={() => {
          setProgress(100);
          setTimeout(() => setLoading(false), 200);
        }}
        style={{ visibility: loading ? 'hidden' : 'visible' }}
      />
    </div>
  );
};

// Desktop app configurations
const desktopApps = [
  {
    id: 'vscode',
    name: 'Tech Stack Analyzer',
    icon: Code2,
    autoOpen: true
  },
  {
    id: 'paint',
    name: 'Excalidraw',
    icon: Palette,
    component: () => <IframeLoader src="https://excalidraw.com/" title="Excalidraw" />
  },
  {
    id: 'circuit',
    name: 'Circuit Sim',
    icon: CircuitBoard,
    component: () => <IframeLoader src="https://www.falstad.com/circuit/circuitjs.html" title="Circuit Simulator" />
  },
  {
    id: 'nodeRepl',
    name: 'Event Loop Viewer',
    icon: Terminal,
    component: () => <IframeLoader src="https://vagostep.github.io/Node-EventLoop-Visualizer/" title="Event Loop Visualizer" />
  },
  {
    id: 'space',
    name: 'ISS Tracker',
    icon: Satellite,
    component: () => <IframeLoader src="https://www.n2yo.com/satellite/?s=25544" title="ISS Live Tracker" />
  },
  {
    id: 'waves',
    name: 'Wave Lab',
    icon: Radio,
    component: () => <IframeLoader src="https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_en.html" title="Wave Interference Simulator" />
  },
  {
    id: 'regex',
    name: 'RegEx Tool',
    icon: Regex,
    component: () => <IframeLoader src="https://regexr.com/" title="RegEx Playground" />
  },
  {
    id: 'notepad',
    name: 'Notepad',
    icon: NotebookPen,
    component: Notepad
  },
  {
    id: 'wigglypaint',
    name: 'Wiggly Paint',
    icon: Sparkles,
    component: () => <IframeLoader src="https://wigglypaint.net/assets/content/wiggly_1_3_1.html" title="Wiggly Paint" />
  },
  {
    id: 'minesweeper',
    name: 'Minesweeper',
    icon: Grid3x3,
    component: () => <IframeLoader src="https://codepen.io/kfalencik/embed/LYrpdPp/?theme-id=modal&default-tab=result&editable=false" title="Minesweeper" />
  },
  {
    id: 'crash',
    name: 'Crash System',
    icon: AlertTriangle,
    component: null // Special handling for BSOD trigger
  }
];

const TechTab = ({ section, caseStudy }) => {
  const navigate = useNavigate();
  const projectName = caseStudy?.hero?.title || 'Project';
  const [showBoot, setShowBoot] = useState(true);
  const [windows, setWindows] = useState([]);
  const [focusedWindow, setFocusedWindow] = useState(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveApp, setMobileActiveApp] = useState(null);
  
  const handleBootComplete = () => {
    setShowBoot(false);
    // Open VSCode window automatically
    const vsCodeWindow = {
      id: 'vscode',
      title: `${projectName} - Tech Stack Analyzer`,
      component: (props) => <VSCodeInterface {...props} fileStructure={caseStudy?.techStackAnalyzer?.fileStructure} />,
      position: { x: 100, y: 50 },
      zIndex: 1,
      icon: Code2
    };
    setWindows([vsCodeWindow]);
    setFocusedWindow('vscode');
  };
  
  
  const closeWindow = (windowId) => {
    setWindows(windows.filter(w => w.id !== windowId));
  };
  
  const minimizeWindow = (windowId) => {
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, isMinimized: true } : w
    ));
  };
  
  const restoreWindow = (windowId) => {
    setWindows(windows.map(w => 
      w.id === windowId ? { ...w, isMinimized: false } : w
    ));
    focusWindow(windowId);
  };
  
  const openDesktopApp = (app) => {
    if (!windows.find(w => w.id === app.id)) {
      const newWindow = {
        id: app.id,
        title: app.name,
        component: app.component,
        position: { x: 150 + windows.length * 30, y: 50 + windows.length * 30 },
        zIndex: nextZIndex,
        icon: app.icon
      };
      setWindows([...windows, newWindow]);
      setFocusedWindow(app.id);
      setNextZIndex(nextZIndex + 1);
    } else {
      // Focus existing window
      focusWindow(app.id);
    }
  };
  
  const focusWindow = (windowId) => {
    if (focusedWindow !== windowId) {
      setFocusedWindow(windowId);
      setWindows(windows.map(w => 
        w.id === windowId ? { ...w, zIndex: nextZIndex } : w
      ));
      setNextZIndex(nextZIndex + 1);
    }
  };
  
  const isDark = document.documentElement.classList.contains('dark');
  
  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  
  // Close start menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (startMenuOpen && !e.target.closest('.start-menu-container')) {
        setStartMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [startMenuOpen]);
  
  return (
    <div className="relative h-full overflow-hidden bg-[#008080]">
      <AnimatePresence>
        {showBoot && <BootScreen onBootComplete={handleBootComplete} projectName={projectName} />}
        {showBSOD && (
          <BlueScreenOfDeath 
            onRestart={() => {
              setShowBSOD(false);
              setShowBoot(true);
              setWindows([]);
              setStartMenuOpen(false);
              setBsodTriggerCount(0);
              setTimeout(() => {
                handleBootComplete();
              }, 100);
            }}
          />
        )}
      </AnimatePresence>
      
      {!showBoot && !isMobile && (
        <>
          {/* Desktop */}
          <div className="absolute inset-0 bg-[#008080]">
            {/* Desktop Icons */}
            <div className="absolute inset-0 p-2" style={{ fontFamily: 'MS Sans Serif, sans-serif' }}>
              <div className="grid grid-cols-2 gap-2 w-[160px]">
                {desktopApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      if (app.id === 'crash') {
                        // Trigger BSOD
                        setShowBSOD(true);
                      } else if (app.id === 'vscode') {
                        // Special handling for VS Code
                        if (!windows.find(w => w.id === 'vscode')) {
                          const vsCodeWindow = {
                            id: 'vscode',
                            title: `${projectName} - Tech Stack Analyzer`,
                            component: (props) => <VSCodeInterface {...props} fileStructure={caseStudy?.techStackAnalyzer?.fileStructure} />,
                            position: { x: 100, y: 50 },
                            zIndex: nextZIndex,
                            icon: Code2
                          };
                          setWindows([...windows, vsCodeWindow]);
                          setFocusedWindow('vscode');
                          setNextZIndex(nextZIndex + 1);
                        } else {
                          focusWindow('vscode');
                        }
                      } else {
                        openDesktopApp(app);
                      }
                    }}
                    className="group flex flex-col items-center p-1 w-[75px] h-[75px] hover:bg-blue-600/20 focus:bg-blue-600/30 rounded-xs outline-hidden"
                    style={{ WebkitFontSmoothing: 'none', MozOsxFontSmoothing: 'grayscale' }}
                  >
                    {/* Icon container with Windows 98 style */}
                    <div className="relative mb-1">
                      <div className={`
                        w-[32px] h-[32px] flex items-center justify-center
                        ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                        border
                        ${isDark ? 'border-t-gray-500 border-l-gray-500' : 'border-t-white border-l-white'}
                        ${isDark ? 'border-r-gray-900 border-b-gray-900' : 'border-r-gray-600 border-b-gray-600'}
                      `}>
                        <app.icon className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} strokeWidth={1} />
                      </div>
                      {/* Icon shadow effect */}
                      <div className="absolute inset-0 translate-x-0.5 translate-y-0.5 opacity-30 pointer-events-none">
                        <div className="w-[32px] h-[32px] bg-black" />
                      </div>
                    </div>
                    {/* Icon label */}
                    <span className={`
                      text-[11px] leading-tight text-center px-1 py-0.5 rounded-xs
                      ${isDark ? 'text-white' : 'text-white'}
                      ${isDark ? 'group-hover:bg-blue-600 group-focus:bg-blue-600' : 'group-hover:bg-[#000080] group-focus:bg-[#000080]'}
                      wrap-break-word w-full
                    `}
                    style={{ 
                      textShadow: isDark ? '1px 1px 1px rgba(0,0,0,0.8)' : '1px 1px 1px rgba(0,0,0,1)',
                      letterSpacing: '0.5px'
                    }}>
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Taskbar */}
            <div className={`
              absolute bottom-0 left-0 right-0 h-10
              ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
              border-t-2
              ${isDark ? 'border-gray-600' : 'border-white'}
            `}>
              <div className="flex items-center h-full px-2 gap-1 relative start-menu-container">
                <button 
                  onClick={() => setStartMenuOpen(!startMenuOpen)}
                  className={`
                    px-3 py-1 text-sm font-bold flex items-center gap-2
                    ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                    border
                    ${startMenuOpen 
                      ? (isDark ? 'border-b-gray-500 border-r-gray-500 border-t-gray-900 border-l-gray-900' : 
                         'border-b-white border-r-white border-t-black border-l-black')
                      : (isDark ? 'border-t-gray-500 border-l-gray-500 border-r-gray-900 border-b-gray-900' : 
                         'border-t-white border-l-white border-r-black border-b-black')
                    }
                  `}
                  style={{ fontFamily: 'MS Sans Serif, sans-serif' }}
                >
                  <div className="w-4 h-4 bg-linear-to-br from-red-500 via-yellow-500 to-blue-500 rounded-xs" />
                  Start
                </button>
                
                {/* Start Menu */}
                {startMenuOpen && (
                  <div 
                    className={`
                      absolute bottom-full left-0 mb-0.5 w-[250px]
                      ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
                      border-2
                      ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                      ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                    `}
                    style={{ fontFamily: 'MS Sans Serif, sans-serif' }}
                  >
                    {/* Windows 98 banner */}
                    <div className={`
                      h-[60px] bg-linear-to-b 
                      ${isDark ? 'from-gray-700 to-gray-900' : 'from-[#000080] to-[#1084d0]'}
                      flex items-center pl-1
                    `}>
                      <div className="text-white font-bold text-lg">
                        CodeOS<span className="font-normal"> 98</span>
                      </div>
                    </div>
                    
                    {/* Menu items */}
                    <div className={`${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                      {desktopApps.map((app, index) => (
                        <React.Fragment key={app.id}>
                          <button
                            onClick={() => {
                              setStartMenuOpen(false);
                              if (app.id === 'vscode') {
                                if (!windows.find(w => w.id === 'vscode')) {
                                  const vsCodeWindow = {
                                    id: 'vscode',
                                    title: `${projectName} - Tech Stack Analyzer`,
                                    component: VSCodeInterface,
                                    props: {
                                      section: 'frontend',
                                      projectName: caseStudy?.hero?.title || 'Project',
                                      fileStructure: caseStudy?.techStackAnalyzer?.fileStructure
                                    },
                                    position: { x: 100, y: 50 },
                                    zIndex: nextZIndex,
                                    icon: Code2
                                  };
                                  setWindows([...windows, vsCodeWindow]);
                                  setFocusedWindow('vscode');
                                  setNextZIndex(nextZIndex + 1);
                                } else {
                                  focusWindow('vscode');
                                }
                              } else {
                                openDesktopApp(app);
                              }
                            }}
                            className={`
                              w-full px-3 py-2 flex items-center gap-3 text-sm text-left
                              ${isDark ? 'hover:bg-blue-600 hover:text-white' : 'hover:bg-[#000080] hover:text-white'}
                              transition-colors
                            `}
                          >
                            <app.icon className="w-4 h-4" />
                            <span>{app.name}</span>
                          </button>
                          {index === 0 && (
                            <div className={`mx-2 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                          )}
                        </React.Fragment>
                      ))}
                      
                      <div className={`mx-2 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                      
                      <button
                        onClick={() => {
                          setShowShutdownDialog(true);
                          setStartMenuOpen(false);
                        }}
                        className={`
                          w-full px-3 py-2 flex items-center gap-3 text-sm text-left
                          ${isDark ? 'hover:bg-blue-600 hover:text-white' : 'hover:bg-[#000080] hover:text-white'}
                          transition-colors
                        `}
                      >
                        <Zap className="w-4 h-4" />
                        <span>Shut Down...</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex-1 flex gap-1 ml-2">
                  {windows.map(window => (
                    <button
                      key={window.id}
                      onClick={() => window.isMinimized ? restoreWindow(window.id) : focusWindow(window.id)}
                      className={`
                        px-3 py-1 text-sm flex items-center gap-2
                        ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                        border
                        ${focusedWindow === window.id && !window.isMinimized ? 
                          (isDark ? 'border-b-gray-500 border-r-gray-500 border-t-gray-900 border-l-gray-900' : 
                           'border-b-white border-r-white border-t-black border-l-black') :
                          (isDark ? 'border-t-gray-500 border-l-gray-500 border-r-gray-900 border-b-gray-900' : 
                           'border-t-white border-l-white border-r-black border-b-black')
                        }
                      `}
                    >
                      <window.icon className="w-4 h-4" />
                      {window.title}
                    </button>
                  ))}
                </div>
                
                {/* System Tray */}
                <div className={`
                  flex items-center gap-2 px-2
                  ${isDark ? 'border-l border-gray-700' : 'border-l border-gray-400'}
                `}>
                  <div className={`
                    px-2 py-1 text-xs flex flex-col items-center justify-center
                    ${isDark ? 'text-gray-300' : 'text-black'}
                    ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-300'}
                    cursor-pointer
                  `}
                  title={currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  >
                    <div>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div style={{ fontSize: '10px' }}>{currentTime.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: '2-digit' })}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Windows */}
          {windows.map(window => (
            <Window98
              key={window.id}
              title={window.title}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              isMinimized={window.isMinimized || false}
              defaultPosition={window.position}
              zIndex={window.zIndex}
              onFocus={() => focusWindow(window.id)}
              icon={window.icon}
            >
              <React.Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
                <window.component 
                  section={section} 
                  projectName={projectName}
                  fileStructure={window.id === 'vscode' ? caseStudy?.techStackAnalyzer?.fileStructure : undefined}
                />
              </React.Suspense>
            </Window98>
          ))}
          
          {/* Shutdown Dialog */}
          {showShutdownDialog && (
            <div className="fixed inset-0 flex items-center justify-center z-9999">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowShutdownDialog(false)} />
              <div 
                className={`
                  relative w-[300px]
                  ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
                  border-2
                  ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                  ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                `}
                style={{ fontFamily: 'MS Sans Serif, sans-serif' }}
              >
                {/* Title bar */}
                <div className={`
                  h-[24px] px-1 flex items-center justify-between
                  ${isDark ? 'bg-linear-to-r from-gray-700 to-gray-900' : 'bg-linear-to-r from-[#000080] to-[#1084d0]'}
                `}>
                  <span className="text-white text-sm font-bold">Shut Down CodeOS</span>
                  <button
                    onClick={() => setShowShutdownDialog(false)}
                    className={`
                      w-[16px] h-[14px] flex items-center justify-center text-black
                      ${isDark ? 'bg-gray-600' : 'bg-[#c0c0c0]'}
                      border
                      ${isDark ? 'border-t-gray-400 border-l-gray-400' : 'border-t-white border-l-white'}
                      ${isDark ? 'border-r-gray-800 border-b-gray-800' : 'border-r-black border-b-black'}
                      text-xs font-bold
                    `}
                  >
                    ×
                  </button>
                </div>
                
                {/* Content */}
                <div className={`p-4 ${isDark ? 'text-white' : 'text-black'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <Power className="w-8 h-8 text-yellow-600 shrink-0 mt-1" />
                    <div>
                      <p className="text-sm">Return to main site?</p>
                      <p className="text-xs mt-1 opacity-75">This will close the CodeOS 98 environment.</p>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate('/')}
                      className={`
                        px-4 py-1 text-sm
                        ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                        border-2
                        ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                        ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                        active:border-t-gray-800 active:border-l-gray-800
                        active:border-r-white active:border-b-white
                      `}
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setShowShutdownDialog(false)}
                      className={`
                        px-4 py-1 text-sm
                        ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                        border-2
                        ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                        ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                        active:border-t-gray-800 active:border-l-gray-800
                        active:border-r-white active:border-b-white
                      `}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Mobile Interface */}
      {!showBoot && isMobile && (
        <>
          {/* Mobile App View */}
          {mobileActiveApp ? (
            <div className="absolute inset-0 flex flex-col bg-[#008080]">
              {/* Mobile Title Bar */}
              <div className={`
                h-12 px-3 flex items-center justify-between
                ${isDark ? 'bg-linear-to-r from-gray-700 to-gray-600' : 'bg-linear-to-r from-[#000080] to-[#1084d0]'}
              `}>
                <div className="flex items-center gap-2">
                  {(() => {
                    const app = desktopApps.find(a => a.id === mobileActiveApp);
                    const Icon = app?.icon || FileText;
                    return (
                      <>
                        <Icon className="w-5 h-5 text-white" />
                        <span className="text-white text-sm font-bold">{app?.name || 'App'}</span>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setMobileActiveApp(null)}
                  className={`
                    w-8 h-8 flex items-center justify-center
                    ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                    border
                    ${isDark ? 'border-t-gray-500 border-l-gray-500' : 'border-t-white border-l-white'}
                    ${isDark ? 'border-r-gray-900 border-b-gray-900' : 'border-r-black border-b-black'}
                  `}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Mobile App Content */}
              <div className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-white'} overflow-auto`}>
                {mobileActiveApp === 'vscode' ? (
                  <VSCodeInterface 
                    section={section} 
                    projectName={projectName}
                    fileStructure={caseStudy?.techStackAnalyzer?.fileStructure}
                  />
                ) : (
                  (() => {
                    const app = desktopApps.find(a => a.id === mobileActiveApp);
                    const Component = app?.component;
                    return Component ? <Component /> : <div className="p-4">App not available</div>;
                  })()
                )}
              </div>
            </div>
          ) : (
            /* Mobile Desktop */
            <div className="absolute inset-0 flex flex-col bg-[#008080]">
              {/* Mobile Desktop Grid */}
              <div className="flex-1 overflow-auto p-2">
                <div className="grid grid-cols-4 gap-1">
                  {desktopApps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        if (app.id === 'crash') {
                          setShowBSOD(true);
                        } else {
                          setMobileActiveApp(app.id);
                        }
                      }}
                      className="flex flex-col items-center p-1"
                    >
                      <div className={`
                        w-12 h-12 flex items-center justify-center mb-1
                        ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                        border
                        ${isDark ? 'border-t-gray-500 border-l-gray-500' : 'border-t-white border-l-white'}
                        ${isDark ? 'border-r-gray-900 border-b-gray-900' : 'border-r-gray-600 border-b-gray-600'}
                      `}>
                        <app.icon className={`w-6 h-6 ${isDark ? 'text-white' : 'text-black'}`} />
                      </div>
                      <span className={`
                        text-[10px] text-center px-0.5 leading-tight
                        ${isDark ? 'text-white' : 'text-white'}
                      `}
                      style={{ 
                        textShadow: isDark ? '1px 1px 1px rgba(0,0,0,0.8)' : '1px 1px 1px rgba(0,0,0,1)'
                      }}>
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Taskbar */}
              <div className={`
                h-14 px-3 flex items-center justify-center relative
                ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
                border-t-2
                ${isDark ? 'border-gray-600' : 'border-white'}
              `}>
                <div className="relative start-menu-container">
                  <button 
                    onClick={() => setStartMenuOpen(!startMenuOpen)}
                    className={`
                      px-4 py-2 text-sm font-bold flex items-center gap-2
                      ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                      border
                      ${startMenuOpen 
                        ? (isDark ? 'border-b-gray-500 border-r-gray-500 border-t-gray-900 border-l-gray-900' : 
                           'border-b-white border-r-white border-t-black border-l-black')
                        : (isDark ? 'border-t-gray-500 border-l-gray-500 border-r-gray-900 border-b-gray-900' : 
                           'border-t-white border-l-white border-r-black border-b-black')
                      }
                    `}
                  >
                    <div className="w-4 h-4 bg-linear-to-br from-red-500 via-yellow-500 to-blue-500 rounded-xs" />
                    Start
                  </button>
                  
                  {/* Mobile Start Menu */}
                  {startMenuOpen && (
                    <div 
                      className={`
                        absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 w-[250px]
                        ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
                        border-2
                        ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                        ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                      `}
                      style={{ fontFamily: 'MS Sans Serif, sans-serif' }}
                    >
                      {/* Windows 98 banner */}
                      <div className={`
                        h-[60px] bg-linear-to-b 
                        ${isDark ? 'from-gray-700 to-gray-900' : 'from-[#000080] to-[#1084d0]'}
                        flex items-center pl-1
                      `}>
                        <div className="text-white font-bold text-lg">
                          CodeOS<span className="font-normal"> 98</span>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        {desktopApps.map((app, index) => (
                          <React.Fragment key={app.id}>
                            <button
                              onClick={() => {
                                setStartMenuOpen(false);
                                if (app.id === 'crash') {
                                  setShowBSOD(true);
                                } else {
                                  setMobileActiveApp(app.id);
                                }
                              }}
                              className={`
                                w-full px-3 py-2 flex items-center gap-3 text-sm text-left
                                ${isDark ? 'hover:bg-blue-600 hover:text-white' : 'hover:bg-[#000080] hover:text-white'}
                                transition-colors
                              `}
                            >
                              <app.icon className="w-4 h-4" />
                              <span>{app.name}</span>
                            </button>
                            {index === 0 && (
                              <div className={`mx-2 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                            )}
                          </React.Fragment>
                        ))}
                        
                        <div className={`mx-2 h-px ${isDark ? 'bg-gray-600' : 'bg-gray-400'}`} />
                        
                        <button
                          onClick={() => {
                            setShowShutdownDialog(true);
                            setStartMenuOpen(false);
                          }}
                          className={`
                            w-full px-3 py-2 flex items-center gap-3 text-sm text-left
                            ${isDark ? 'hover:bg-blue-600 hover:text-white' : 'hover:bg-[#000080] hover:text-white'}
                            transition-colors
                          `}
                        >
                          <Zap className="w-4 h-4" />
                          <span>Shut Down...</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`
                  absolute right-3 px-2 py-1 text-xs
                  ${isDark ? 'text-gray-300' : 'text-black'}
                `}>
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Shutdown Dialog */}
          {showShutdownDialog && (
            <div className="fixed inset-0 flex items-center justify-center z-9999 p-4">
              <div className="absolute inset-0 bg-black/50" onClick={() => setShowShutdownDialog(false)} />
              <div 
                className={`
                  relative w-full max-w-sm
                  ${isDark ? 'bg-gray-800' : 'bg-[#c0c0c0]'}
                  border-2
                  ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                  ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                `}
              >
                <div className={`
                  h-8 px-2 flex items-center justify-between
                  ${isDark ? 'bg-linear-to-r from-gray-700 to-gray-900' : 'bg-linear-to-r from-[#000080] to-[#1084d0]'}
                `}>
                  <span className="text-white text-sm font-bold">Shut Down CodeOS</span>
                  <button
                    onClick={() => setShowShutdownDialog(false)}
                    className={`
                      w-6 h-6 flex items-center justify-center text-black
                      ${isDark ? 'bg-gray-600' : 'bg-[#c0c0c0]'}
                      border
                      ${isDark ? 'border-t-gray-400 border-l-gray-400' : 'border-t-white border-l-white'}
                      ${isDark ? 'border-r-gray-800 border-b-gray-800' : 'border-r-black border-b-black'}
                    `}
                  >
                    ×
                  </button>
                </div>
                
                <div className={`p-4 ${isDark ? 'text-white' : 'text-black'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    <Power className="w-8 h-8 text-yellow-600 shrink-0" />
                    <div>
                      <p className="text-sm">Return to main site?</p>
                      <p className="text-xs mt-1 opacity-75">This will close the CodeOS 98 environment.</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => navigate('/')}
                      className={`
                        px-4 py-2 text-sm
                        ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                        border-2
                        ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                        ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                      `}
                    >
                      OK
                    </button>
                    <button
                      onClick={() => setShowShutdownDialog(false)}
                      className={`
                        px-4 py-2 text-sm
                        ${isDark ? 'bg-gray-700' : 'bg-[#c0c0c0]'}
                        border-2
                        ${isDark ? 'border-t-gray-600 border-l-gray-600' : 'border-t-white border-l-white'}
                        ${isDark ? 'border-r-black border-b-black' : 'border-r-gray-800 border-b-gray-800'}
                      `}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TechTab;
