# Development Roadmap: PoC to MVP Evolution

## Project Overview

This roadmap provides detailed, actionable steps for your development team to evolve the current agent-terminal-orchestrator proof-of-concept into a production-ready minimum viable product (MVP). The roadmap is structured in phases that can be executed by your development team using the specified tools: cursor mcp, Claude code, Gemini code, and Ubuntu WSL connection, with optional Docker integration.

## Phase 1: Foundation and Infrastructure Setup (Weeks 1-2)

### Week 1: Development Environment Preparation

The first week focuses on establishing a robust development environment that supports the dual-terminal architecture and MCP-first principles. Your development team should begin by setting up the necessary infrastructure components that will support the enhanced functionality.

**Day 1-2: Repository Structure Reorganization**

Begin by restructuring the existing repository to support the modular architecture. Create a monorepo structure that separates concerns while maintaining the ability to develop and deploy components independently. The new structure should include dedicated directories for frontend components, backend services, container configurations, and shared utilities.

Create the following directory structure in your existing repository:

```
agent-terminal-orchestrator/
├── frontend/                 # React/TypeScript frontend
├── services/
│   ├── gateway/             # WebSocket gateway service
│   ├── repository-manager/  # Repository management service
│   ├── runtime-manager/     # Terminal runtime management
│   └── tool-integration/    # MCP tool integration layer
├── containers/
│   ├── base/               # Base container images
│   ├── runtimes/           # Runtime-specific containers
│   └── tools/              # Tool integration containers
├── shared/
│   ├── protocols/          # MCP protocol definitions
│   ├── types/              # Shared TypeScript types
│   └── utils/              # Common utilities
├── deployment/
│   ├── docker-compose/     # Development deployment
│   ├── kubernetes/         # Production deployment
│   └── scripts/            # Deployment automation
└── docs/                   # Documentation and specifications
```

**Day 3-4: Docker Infrastructure Setup**

Establish the Docker infrastructure that will support containerized development and deployment. Create base container images for each supported runtime environment, ensuring they include the necessary development tools and security configurations.

Start by creating a base Ubuntu container that includes essential development tools:

```dockerfile
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    nano \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN useradd -m -s /bin/bash developer
USER developer
WORKDIR /workspace

# Install common development tools
RUN npm install -g yarn pnpm
RUN pip3 install --user virtualenv pipenv
```

Create specialized containers for each runtime environment, building upon the base image while adding runtime-specific tools and configurations. For PowerShell support on Linux, include PowerShell Core installation. For WSL integration, ensure proper mounting and permission handling.

**Day 5: Development Tool Integration**

Configure the development environment to work seamlessly with cursor mcp, Claude code, and Gemini code. This involves setting up the necessary protocol adapters and ensuring that the development tools can communicate with your local development environment.

Create configuration files for each tool integration, defining the communication protocols and authentication mechanisms. Establish development workflows that allow your team to use these tools effectively during the development process.

### Week 2: Core Service Implementation

**Day 1-3: Enhanced WebSocket Gateway**

Extend the existing Node.js/Express WebSocket gateway to support the dual-terminal architecture and MCP protocol communication. The enhanced gateway should handle session multiplexing, allowing multiple terminal sessions per user while maintaining proper isolation and security.

Implement the following key features in the gateway service:

Session management capabilities that can track multiple concurrent terminal sessions per user, with proper cleanup and resource management. Add protocol routing functionality that can distinguish between different types of messages (terminal I/O, repository operations, tool integrations) and route them to appropriate handlers.

Create MCP protocol handlers that can parse and respond to MCP messages according to the protocol specification. Implement authentication and authorization middleware that validates user sessions and enforces access controls.

Add comprehensive error handling and logging to ensure that issues can be quickly identified and resolved during development and production operation.

**Day 4-5: Repository Management Service**

Develop a new Python/Flask service dedicated to repository operations. This service should provide a clean API for common repository operations while integrating seamlessly with the terminal runtime environments.

The repository management service should include functionality for cloning repositories from various sources (GitHub, GitLab, Bitbucket, etc.), with proper authentication handling for private repositories. Implement dependency detection and installation automation that can identify project types (Node.js, Python, etc.) and automatically install required dependencies.

Create project structure analysis capabilities that can examine cloned repositories and provide insights about the project structure, available scripts, and recommended setup procedures. Implement build and run command detection that can automatically identify how to build and run projects based on common patterns and configuration files.

Add integration points with the terminal runtime containers, allowing repository operations to be executed within the appropriate runtime environment while maintaining proper isolation and security.

## Phase 2: Frontend Enhancement and Dual-Terminal Implementation (Weeks 3-4)

### Week 3: Frontend Architecture Redesign

**Day 1-2: Dual-Terminal Layout Implementation**

Redesign the frontend interface to support the dual-terminal requirement with a fixed side-by-side layout. The new interface should provide users with two independent terminal panes that can operate simultaneously while sharing certain operational contexts when beneficial.

Implement a resizable splitter component that allows users to adjust the relative sizes of the two terminal panes according to their preferences. Create terminal session management logic that can handle multiple concurrent xterm.js instances while maintaining proper event handling and resource cleanup.

Add synchronization options that allow users to choose whether the two terminals should operate independently or share certain contexts such as working directory or environment variables. Implement terminal session persistence that can restore terminal states across browser sessions.

**Day 3-4: Repository Operations UI**

Create user interface components for repository operations that integrate seamlessly with the dual-terminal layout. The repository UI should provide intuitive controls for common operations while leveraging the power of the underlying terminal environments.

Implement a repository browser that can display the structure of cloned repositories and allow users to navigate and open files. Create quick action buttons for common repository operations such as cloning, pulling, pushing, and running build scripts.

Add status indicators that show the current state of repository operations, including progress bars for long-running operations and error notifications for failed operations. Implement integration with the terminal panes, allowing repository operations to be executed in either terminal while displaying output in real-time.

**Day 5: Tool Integration Interface**

Develop user interface components that support integration with external development tools. The tool integration interface should provide seamless access to cursor mcp, Claude code, and Gemini code functionality while maintaining the focus on terminal-based development.

Create dockable panels that can display tool interfaces without interfering with the terminal operations. Implement communication bridges that allow tools to interact with the terminal sessions and repository content. Add configuration interfaces that allow users to customize tool integrations and authentication settings.

### Week 4: Advanced Terminal Features

**Day 1-2: Terminal Runtime Enhancement**

Enhance the terminal runtime management to support the advanced features required for the MVP. This includes implementing proper container lifecycle management, resource monitoring, and security controls.

Develop container orchestration logic that can dynamically spawn and manage terminal runtime containers based on user requests. Implement resource allocation and monitoring that ensures fair resource usage and prevents any single session from consuming excessive resources.

Add security controls that enforce proper isolation between terminal sessions while allowing controlled sharing of resources when appropriate. Implement audit logging that tracks terminal operations for security and compliance purposes.

**Day 3-4: Performance Optimization**

Optimize the performance of the dual-terminal interface to ensure smooth operation even with intensive terminal operations. This includes optimizing WebSocket communication, terminal rendering, and resource usage.

Implement efficient message batching and compression for WebSocket communication to reduce bandwidth usage and improve responsiveness. Optimize xterm.js rendering performance by implementing proper viewport management and lazy loading of terminal history.

Add caching mechanisms for frequently accessed data such as repository metadata and terminal session state. Implement connection pooling and resource reuse to minimize the overhead of creating new terminal sessions.

**Day 5: Testing and Quality Assurance**

Establish comprehensive testing procedures for the dual-terminal functionality. This includes unit tests for individual components, integration tests for service communication, and end-to-end tests for complete user workflows.

Create automated testing scenarios that cover common user workflows such as cloning repositories, running build scripts, and using multiple terminals simultaneously. Implement performance testing that validates the system's ability to handle multiple concurrent users and terminal sessions.

Add monitoring and alerting capabilities that can detect performance issues and system failures in real-time. Create debugging tools that help developers identify and resolve issues quickly during development and production operation.

## Phase 3: MCP Protocol Integration and Tool Connectivity (Weeks 5-6)

### Week 5: MCP Protocol Implementation

**Day 1-2: Protocol Foundation**

Implement the core MCP protocol infrastructure that will enable standardized communication between your terminal orchestrator and external development tools. The protocol implementation should be robust, extensible, and well-documented to support future integrations.

Begin by defining the message schemas and communication patterns that will be used for different types of operations. Create protocol handlers that can parse incoming MCP messages, validate their structure, and route them to appropriate service components.

Implement authentication and authorization mechanisms that ensure only authorized tools can connect and perform operations. Add session management capabilities that can track active tool connections and maintain proper state synchronization.

Create comprehensive logging and monitoring for protocol operations to enable debugging and performance analysis. Implement error handling and recovery mechanisms that can gracefully handle protocol errors and connection failures.

**Day 3-4: Tool-Specific Adapters**

Develop specific protocol adapters for each of the target development tools: cursor mcp, Claude code, and Gemini code. Each adapter should translate between the tool's native communication format and the standardized MCP protocol used internally.

For cursor mcp integration, create adapters that can handle code editing operations, file system access, and terminal command execution. Implement real-time synchronization that allows cursor mcp to reflect changes made in the terminal environment and vice versa.

For Claude code integration, develop adapters that can provide code analysis, generation, and review capabilities. Implement context sharing that allows Claude code to understand the current state of the repository and terminal sessions.

For Gemini code integration, create adapters that support advanced code understanding and manipulation features. Implement collaborative editing capabilities that allow multiple tools to work together on the same codebase.

**Day 5: Integration Testing**

Conduct comprehensive testing of the MCP protocol implementation and tool integrations. This includes testing individual tool connections, multi-tool scenarios, and error handling under various conditions.

Create test scenarios that validate the protocol's ability to handle concurrent connections from multiple tools while maintaining proper isolation and security. Test the performance impact of tool integrations on terminal operations and overall system responsiveness.

Implement automated testing for protocol compliance and compatibility with different versions of the integrated tools. Create debugging tools that can help developers troubleshoot protocol issues and optimize performance.

### Week 6: Advanced Integration Features

**Day 1-2: Collaborative Development Features**

Implement advanced collaborative development features that leverage the MCP protocol integration. These features should enable seamless collaboration between different tools and users working on the same project.

Create shared workspace functionality that allows multiple users to collaborate on the same repository while maintaining proper access controls and conflict resolution. Implement real-time synchronization of file changes, terminal operations, and tool interactions.

Add collaborative editing capabilities that allow multiple tools to work on the same files simultaneously while preventing conflicts and maintaining consistency. Implement change tracking and version control integration that provides visibility into who made what changes and when.

Create communication channels that allow collaborators to share information and coordinate their work effectively. Implement notification systems that alert users to important events and changes in the shared workspace.

**Day 3-4: Automation and Workflow Integration**

Develop automation capabilities that can streamline common development workflows by integrating terminal operations with tool functionality. This includes creating workflow templates and automation scripts that can be triggered by various events.

Implement workflow templates for common development scenarios such as setting up new projects, running test suites, and deploying applications. Create automation triggers that can execute workflows based on repository changes, terminal commands, or tool interactions.

Add integration with external CI/CD systems that can trigger builds and deployments based on terminal operations and tool interactions. Implement status reporting that provides visibility into the progress and results of automated workflows.

Create customization capabilities that allow users to define their own workflows and automation rules based on their specific development needs and preferences.

**Day 5: Documentation and Training Materials**

Create comprehensive documentation for the MCP protocol integration and tool connectivity features. This documentation should serve both as a reference for developers and as training material for end users.

Develop API documentation that describes the MCP protocol implementation, including message schemas, authentication mechanisms, and error handling procedures. Create integration guides for each supported tool that provide step-by-step instructions for setup and configuration.

Write user guides that explain how to use the collaborative development features and automation capabilities effectively. Create troubleshooting guides that help users resolve common issues and optimize their development workflows.

Develop training materials such as video tutorials and interactive demos that help users understand and adopt the new features quickly and effectively.

## Phase 4: Security, Performance, and Production Readiness (Weeks 7-8)

### Week 7: Security Hardening

**Day 1-2: Container Security Implementation**

Implement comprehensive security measures for the containerized terminal runtime environments. This includes hardening container configurations, implementing proper isolation, and establishing security monitoring.

Configure containers to run with minimal privileges, using non-root users and read-only file systems where possible. Implement resource limits that prevent any single container from consuming excessive system resources or affecting other containers.

Add network isolation that restricts container communication to only necessary services while preventing unauthorized access to external resources. Implement security scanning that regularly checks container images for vulnerabilities and ensures they are kept up to date.

Create security policies that define acceptable use of terminal operations and enforce restrictions on potentially dangerous commands. Implement audit logging that tracks all terminal operations and provides forensic capabilities for security investigations.

**Day 3-4: Authentication and Authorization**

Develop robust authentication and authorization systems that protect access to terminal sessions and repository operations. This includes implementing multi-factor authentication, role-based access controls, and session management.

Create user authentication mechanisms that support various authentication methods including username/password, OAuth, and integration with enterprise identity providers. Implement session management that provides secure token handling and automatic session expiration.

Add role-based access controls that allow administrators to define different levels of access for different types of users. Implement fine-grained permissions that control access to specific repositories, terminal operations, and tool integrations.

Create audit trails that track authentication events, authorization decisions, and user activities for compliance and security monitoring purposes.

**Day 5: Security Testing and Validation**

Conduct comprehensive security testing to validate the effectiveness of implemented security measures. This includes penetration testing, vulnerability scanning, and security code review.

Perform penetration testing that attempts to identify and exploit security vulnerabilities in the system. Conduct vulnerability scanning of all system components including containers, services, and dependencies.

Review code for security best practices and potential vulnerabilities such as injection attacks, privilege escalation, and data exposure. Test authentication and authorization mechanisms under various attack scenarios.

Create security monitoring and alerting systems that can detect and respond to security incidents in real-time. Implement incident response procedures that define how to handle security breaches and system compromises.

### Week 8: Performance Optimization and Production Deployment

**Day 1-2: Performance Tuning**

Optimize system performance to ensure the MVP can handle production workloads effectively. This includes optimizing resource usage, improving response times, and implementing efficient scaling mechanisms.

Analyze system performance under various load conditions to identify bottlenecks and optimization opportunities. Optimize database queries, WebSocket communication, and container resource allocation to improve overall system responsiveness.

Implement caching strategies that reduce the load on backend services and improve user experience. Add connection pooling and resource reuse mechanisms that minimize the overhead of creating new connections and containers.

Create performance monitoring that provides real-time visibility into system performance and resource usage. Implement alerting that notifies administrators of performance issues before they impact users.

**Day 3-4: Scalability Implementation**

Implement horizontal scaling capabilities that allow the system to handle increased load by adding more instances of services and containers. This includes implementing load balancing, auto-scaling, and distributed state management.

Configure load balancing for WebSocket connections that can distribute user sessions across multiple gateway instances while maintaining session affinity. Implement auto-scaling policies that can automatically add or remove service instances based on resource usage and demand.

Add distributed state management that allows session state to be shared across multiple service instances. Implement database clustering and replication that ensures data availability and consistency across multiple nodes.

Create deployment automation that can deploy new service instances and container images without disrupting existing user sessions. Implement blue-green deployment strategies that allow for zero-downtime updates and rollbacks.

**Day 5: Production Deployment and Monitoring**

Deploy the MVP to a production environment with comprehensive monitoring and alerting capabilities. This includes setting up infrastructure monitoring, application performance monitoring, and user experience tracking.

Configure infrastructure monitoring that tracks server resources, network performance, and container health. Implement application performance monitoring that provides visibility into service response times, error rates, and throughput.

Add user experience monitoring that tracks user interactions, session duration, and feature usage. Create dashboards that provide real-time visibility into system health and performance for operations teams.

Implement log aggregation and analysis that can help identify issues and trends across the distributed system. Create alerting rules that notify operations teams of critical issues and performance degradations.

## Implementation Guidelines and Best Practices

### Development Workflow

Establish a development workflow that supports the iterative development of the MVP while maintaining code quality and system stability. This workflow should integrate with the specified development tools and support collaborative development.

Use feature branches for all development work, with regular integration into the main development branch. Implement code review processes that ensure all changes are reviewed by at least one other developer before being merged.

Create automated testing pipelines that run unit tests, integration tests, and security scans on all code changes. Implement continuous integration that automatically builds and tests the system whenever changes are made.

Use the cursor mcp, Claude code, and Gemini code tools throughout the development process to enhance productivity and code quality. Establish guidelines for how these tools should be used and integrated into the development workflow.

### Quality Assurance

Implement comprehensive quality assurance processes that ensure the MVP meets functional requirements and performance standards. This includes automated testing, manual testing, and user acceptance testing.

Create automated test suites that cover all major functionality including terminal operations, repository management, tool integrations, and security features. Implement performance testing that validates the system's ability to handle expected load levels.

Conduct manual testing of user workflows to ensure the system provides a good user experience and meets usability requirements. Perform compatibility testing across different browsers, operating systems, and development environments.

Create user acceptance testing procedures that involve stakeholders in validating that the system meets business requirements and user needs.

### Documentation and Knowledge Management

Maintain comprehensive documentation throughout the development process to ensure knowledge is preserved and shared effectively among team members. This includes technical documentation, user documentation, and operational procedures.

Create technical documentation that describes system architecture, API specifications, and deployment procedures. Maintain user documentation that provides clear instructions for using all system features and capabilities.

Document operational procedures for system administration, monitoring, and troubleshooting. Create knowledge base articles that capture lessons learned and best practices discovered during development.

Implement documentation review processes that ensure all documentation is kept up to date and accurate as the system evolves.

### Risk Management

Identify and mitigate risks that could impact the successful delivery of the MVP. This includes technical risks, security risks, and project management risks.

Create risk assessment procedures that regularly evaluate potential risks and their impact on the project. Implement mitigation strategies for identified risks including technical alternatives, security measures, and contingency plans.

Establish communication procedures that ensure all stakeholders are informed of risks and mitigation efforts. Create escalation procedures for handling critical issues that could impact project delivery.

Implement monitoring and alerting that can detect risk indicators early and trigger appropriate response procedures.

This comprehensive development roadmap provides your team with detailed, actionable steps for evolving the current PoC into a production-ready MVP. The roadmap is designed to be executed using your specified tools and infrastructure while following MCP-first architecture principles. Each phase builds upon the previous one, ensuring steady progress toward the MVP goals while maintaining system quality and security.



## Technical Implementation Details

### Frontend Implementation Specifics

The frontend enhancement requires careful consideration of state management and component architecture to support the dual-terminal functionality effectively. The existing React/TypeScript codebase provides a solid foundation, but significant modifications are needed to support the MVP requirements.

**Component Architecture Redesign**

The current single-terminal architecture needs to be refactored to support multiple terminal instances with proper state isolation and communication. Create a new `TerminalManager` component that can handle multiple `TerminalInstance` components while maintaining proper lifecycle management.

```typescript
interface TerminalManagerState {
  terminals: Map<string, TerminalInstance>;
  activeTerminal: string | null;
  layout: 'dual' | 'single' | 'quad';
  syncMode: 'independent' | 'synchronized';
}

class TerminalManager extends React.Component<TerminalManagerProps, TerminalManagerState> {
  private terminalRefs: Map<string, React.RefObject<TerminalInstance>>;
  
  constructor(props: TerminalManagerProps) {
    super(props);
    this.terminalRefs = new Map();
    this.state = {
      terminals: new Map(),
      activeTerminal: null,
      layout: 'dual',
      syncMode: 'independent'
    };
  }
  
  createTerminal = (runtime: RuntimeType, position: 'left' | 'right') => {
    const terminalId = generateUniqueId();
    const terminalRef = React.createRef<TerminalInstance>();
    
    this.terminalRefs.set(terminalId, terminalRef);
    
    const newTerminal = new TerminalInstance({
      id: terminalId,
      runtime,
      position,
      onOutput: this.handleTerminalOutput,
      onClose: this.handleTerminalClose
    });
    
    this.setState(prevState => ({
      terminals: new Map(prevState.terminals).set(terminalId, newTerminal),
      activeTerminal: terminalId
    }));
  };
  
  handleTerminalOutput = (terminalId: string, data: string) => {
    if (this.state.syncMode === 'synchronized') {
      // Broadcast output to all terminals if in sync mode
      this.state.terminals.forEach((terminal, id) => {
        if (id !== terminalId) {
          terminal.receiveOutput(data);
        }
      });
    }
  };
}
```

**WebSocket Communication Enhancement**

The WebSocket communication layer needs to be enhanced to support multiple concurrent terminal sessions with proper message routing and session management. Implement a message protocol that can distinguish between different terminal sessions and route messages appropriately.

```typescript
interface TerminalMessage {
  type: 'input' | 'output' | 'control' | 'repository' | 'tool';
  terminalId: string;
  sessionId: string;
  data: any;
  timestamp: number;
}

class WebSocketManager {
  private connections: Map<string, WebSocket>;
  private messageHandlers: Map<string, (message: TerminalMessage) => void>;
  
  constructor() {
    this.connections = new Map();
    this.messageHandlers = new Map();
  }
  
  createConnection = (terminalId: string, runtime: RuntimeType): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      const wsUrl = `ws://localhost:8080/pty?terminal=${terminalId}&runtime=${runtime}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        this.connections.set(terminalId, ws);
        resolve(ws);
      };
      
      ws.onmessage = (event) => {
        const message: TerminalMessage = JSON.parse(event.data);
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
          handler(message);
        }
      };
      
      ws.onerror = (error) => {
        reject(error);
      };
      
      ws.onclose = () => {
        this.connections.delete(terminalId);
      };
    });
  };
  
  sendMessage = (terminalId: string, message: TerminalMessage) => {
    const connection = this.connections.get(terminalId);
    if (connection && connection.readyState === WebSocket.OPEN) {
      connection.send(JSON.stringify(message));
    }
  };
}
```

### Backend Service Implementation

The backend services require significant enhancement to support the MVP functionality while maintaining the MCP-first architecture principles. Each service should be designed as an independent, containerized component that communicates through well-defined protocols.

**Enhanced WebSocket Gateway**

The WebSocket gateway needs to be redesigned to handle multiple concurrent sessions with proper load balancing and failover capabilities. Implement session affinity to ensure that all messages for a particular terminal session are routed to the same backend instance.

```javascript
const express = require('express');
const WebSocket = require('ws');
const { createProxyMiddleware } = require('http-proxy-middleware');

class EnhancedWebSocketGateway {
  constructor() {
    this.app = express();
    this.wss = new WebSocket.Server({ port: 8080 });
    this.sessions = new Map();
    this.runtimeManagers = new Map();
    
    this.setupMiddleware();
    this.setupWebSocketHandling();
  }
  
  setupMiddleware() {
    // CORS configuration for cross-origin requests
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      next();
    });
    
    // Proxy repository management requests
    this.app.use('/api/repository', createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: {
        '^/api/repository': ''
      }
    }));
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    });
  }
  
  setupWebSocketHandling() {
    this.wss.on('connection', (ws, req) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const terminalId = url.searchParams.get('terminal');
      const runtime = url.searchParams.get('runtime');
      
      if (!terminalId || !runtime) {
        ws.close(1008, 'Missing required parameters');
        return;
      }
      
      this.handleNewTerminalSession(ws, terminalId, runtime);
    });
  }
  
  handleNewTerminalSession(ws, terminalId, runtime) {
    const session = {
      id: terminalId,
      runtime,
      websocket: ws,
      runtimeProcess: null,
      createdAt: new Date()
    };
    
    this.sessions.set(terminalId, session);
    
    // Create runtime process
    this.createRuntimeProcess(session)
      .then(() => {
        ws.send(JSON.stringify({
          type: 'control',
          data: { status: 'ready', terminalId }
        }));
      })
      .catch(error => {
        ws.send(JSON.stringify({
          type: 'control',
          data: { status: 'error', error: error.message }
        }));
        ws.close();
      });
    
    ws.on('message', (data) => {
      this.handleWebSocketMessage(session, data);
    });
    
    ws.on('close', () => {
      this.cleanupSession(terminalId);
    });
  }
  
  async createRuntimeProcess(session) {
    const runtimeManager = this.getRuntimeManager(session.runtime);
    session.runtimeProcess = await runtimeManager.createProcess(session.id);
    
    // Pipe runtime output to WebSocket
    session.runtimeProcess.on('data', (data) => {
      session.websocket.send(JSON.stringify({
        type: 'output',
        terminalId: session.id,
        data: data.toString()
      }));
    });
  }
  
  getRuntimeManager(runtime) {
    if (!this.runtimeManagers.has(runtime)) {
      const RuntimeManager = require(`./runtime-managers/${runtime}`);
      this.runtimeManagers.set(runtime, new RuntimeManager());
    }
    return this.runtimeManagers.get(runtime);
  }
}
```

**Repository Management Service**

The repository management service should provide a comprehensive API for repository operations while integrating seamlessly with the terminal runtime environments. Implement proper error handling, progress reporting, and security controls.

```python
from flask import Flask, request, jsonify, stream_template
from flask_cors import CORS
import git
import os
import subprocess
import json
import threading
from datetime import datetime

class RepositoryManager:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.active_operations = {}
        self.setup_routes()
    
    def setup_routes(self):
        @self.app.route('/clone', methods=['POST'])
        def clone_repository():
            data = request.get_json()
            repo_url = data.get('url')
            target_dir = data.get('target_dir')
            terminal_id = data.get('terminal_id')
            
            if not all([repo_url, target_dir, terminal_id]):
                return jsonify({'error': 'Missing required parameters'}), 400
            
            operation_id = self.generate_operation_id()
            
            # Start clone operation in background thread
            thread = threading.Thread(
                target=self.clone_repository_async,
                args=(operation_id, repo_url, target_dir, terminal_id)
            )
            thread.start()
            
            return jsonify({
                'operation_id': operation_id,
                'status': 'started'
            })
        
        @self.app.route('/status/<operation_id>', methods=['GET'])
        def get_operation_status(operation_id):
            operation = self.active_operations.get(operation_id)
            if not operation:
                return jsonify({'error': 'Operation not found'}), 404
            
            return jsonify(operation)
        
        @self.app.route('/analyze', methods=['POST'])
        def analyze_repository():
            data = request.get_json()
            repo_path = data.get('path')
            
            if not repo_path or not os.path.exists(repo_path):
                return jsonify({'error': 'Invalid repository path'}), 400
            
            analysis = self.analyze_repository_structure(repo_path)
            return jsonify(analysis)
    
    def clone_repository_async(self, operation_id, repo_url, target_dir, terminal_id):
        operation = {
            'id': operation_id,
            'type': 'clone',
            'status': 'in_progress',
            'progress': 0,
            'terminal_id': terminal_id,
            'started_at': datetime.now().isoformat()
        }
        
        self.active_operations[operation_id] = operation
        
        try:
            # Create target directory if it doesn't exist
            os.makedirs(target_dir, exist_ok=True)
            
            # Clone repository with progress tracking
            repo = git.Repo.clone_from(
                repo_url,
                target_dir,
                progress=lambda op_code, cur_count, max_count, message: 
                    self.update_clone_progress(operation_id, cur_count, max_count)
            )
            
            operation['status'] = 'completed'
            operation['progress'] = 100
            operation['completed_at'] = datetime.now().isoformat()
            operation['result'] = {
                'repo_path': target_dir,
                'commit_hash': repo.head.commit.hexsha,
                'branch': repo.active_branch.name
            }
            
            # Analyze repository structure
            analysis = self.analyze_repository_structure(target_dir)
            operation['analysis'] = analysis
            
        except Exception as e:
            operation['status'] = 'failed'
            operation['error'] = str(e)
            operation['completed_at'] = datetime.now().isoformat()
    
    def analyze_repository_structure(self, repo_path):
        analysis = {
            'project_type': 'unknown',
            'dependencies': [],
            'scripts': {},
            'build_commands': [],
            'run_commands': []
        }
        
        # Detect project type based on files
        if os.path.exists(os.path.join(repo_path, 'package.json')):
            analysis['project_type'] = 'nodejs'
            with open(os.path.join(repo_path, 'package.json'), 'r') as f:
                package_data = json.load(f)
                analysis['dependencies'] = list(package_data.get('dependencies', {}).keys())
                analysis['scripts'] = package_data.get('scripts', {})
                
                if 'build' in analysis['scripts']:
                    analysis['build_commands'].append('npm run build')
                if 'start' in analysis['scripts']:
                    analysis['run_commands'].append('npm start')
                if 'dev' in analysis['scripts']:
                    analysis['run_commands'].append('npm run dev')
        
        elif os.path.exists(os.path.join(repo_path, 'requirements.txt')):
            analysis['project_type'] = 'python'
            with open(os.path.join(repo_path, 'requirements.txt'), 'r') as f:
                analysis['dependencies'] = [line.strip() for line in f.readlines()]
            
            analysis['build_commands'].append('pip install -r requirements.txt')
            
            # Look for common Python entry points
            if os.path.exists(os.path.join(repo_path, 'app.py')):
                analysis['run_commands'].append('python app.py')
            elif os.path.exists(os.path.join(repo_path, 'main.py')):
                analysis['run_commands'].append('python main.py')
        
        return analysis
```

### Container Runtime Implementation

The container runtime management system needs to provide secure, isolated environments for terminal sessions while supporting the various runtime types required by the MVP. Implement proper resource management, security controls, and monitoring capabilities.

**Base Container Configuration**

Create base container images that provide secure, consistent environments for terminal operations. Each container should include necessary development tools while maintaining minimal attack surface and proper security controls.

```dockerfile
# Base development container
FROM ubuntu:22.04

# Install essential packages
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    vim \
    nano \
    build-essential \
    python3 \
    python3-pip \
    nodejs \
    npm \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user with sudo privileges
RUN useradd -m -s /bin/bash -G sudo developer && \
    echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Install development tools
USER developer
WORKDIR /workspace

RUN npm install -g yarn pnpm @angular/cli create-react-app
RUN pip3 install --user virtualenv pipenv poetry

# Configure git (will be overridden by user config)
RUN git config --global user.name "Developer" && \
    git config --global user.email "developer@example.com"

# Set up shell environment
RUN echo 'export PATH=$PATH:~/.local/bin' >> ~/.bashrc
RUN echo 'alias ll="ls -la"' >> ~/.bashrc
RUN echo 'alias la="ls -A"' >> ~/.bashrc

EXPOSE 3000 8000 8080

CMD ["/bin/bash"]
```

**Runtime Manager Implementation**

Implement a runtime manager that can dynamically create and manage container instances for different terminal sessions. The manager should handle container lifecycle, resource allocation, and security controls.

```python
import docker
import uuid
import threading
import time
from typing import Dict, Optional

class ContainerRuntimeManager:
    def __init__(self):
        self.client = docker.from_env()
        self.containers: Dict[str, docker.models.containers.Container] = {}
        self.container_configs = {
            'ubuntu': {
                'image': 'terminal-orchestrator/ubuntu:latest',
                'command': '/bin/bash',
                'environment': ['TERM=xterm-256color'],
                'working_dir': '/workspace'
            },
            'nodejs': {
                'image': 'terminal-orchestrator/nodejs:latest',
                'command': '/bin/bash',
                'environment': ['TERM=xterm-256color', 'NODE_ENV=development'],
                'working_dir': '/workspace'
            },
            'python': {
                'image': 'terminal-orchestrator/python:latest',
                'command': '/bin/bash',
                'environment': ['TERM=xterm-256color', 'PYTHONPATH=/workspace'],
                'working_dir': '/workspace'
            }
        }
        
        # Start cleanup thread
        self.cleanup_thread = threading.Thread(target=self.cleanup_idle_containers, daemon=True)
        self.cleanup_thread.start()
    
    def create_container(self, terminal_id: str, runtime: str, user_id: str) -> str:
        """Create a new container for a terminal session."""
        
        if runtime not in self.container_configs:
            raise ValueError(f"Unsupported runtime: {runtime}")
        
        config = self.container_configs[runtime].copy()
        container_name = f"terminal-{terminal_id}"
        
        # Add user-specific environment variables
        config['environment'].extend([
            f'USER_ID={user_id}',
            f'TERMINAL_ID={terminal_id}'
        ])
        
        # Create volume for persistent workspace
        workspace_volume = f"workspace-{user_id}"
        
        try:
            container = self.client.containers.run(
                image=config['image'],
                command=config['command'],
                environment=config['environment'],
                working_dir=config['working_dir'],
                name=container_name,
                detach=True,
                stdin_open=True,
                tty=True,
                volumes={
                    workspace_volume: {'bind': '/workspace', 'mode': 'rw'}
                },
                network_mode='bridge',
                mem_limit='512m',
                cpu_quota=50000,  # 50% of one CPU core
                security_opt=['no-new-privileges:true'],
                cap_drop=['ALL'],
                cap_add=['CHOWN', 'DAC_OVERRIDE', 'FOWNER', 'SETGID', 'SETUID']
            )
            
            self.containers[terminal_id] = container
            return container.id
            
        except docker.errors.APIError as e:
            raise RuntimeError(f"Failed to create container: {str(e)}")
    
    def execute_command(self, terminal_id: str, command: str) -> tuple:
        """Execute a command in the specified container."""
        
        container = self.containers.get(terminal_id)
        if not container:
            raise ValueError(f"Container not found for terminal: {terminal_id}")
        
        try:
            exec_result = container.exec_run(
                command,
                stdin=True,
                tty=True,
                stream=True,
                demux=True
            )
            
            return exec_result.output, exec_result.exit_code
            
        except docker.errors.APIError as e:
            raise RuntimeError(f"Failed to execute command: {str(e)}")
    
    def get_container_stats(self, terminal_id: str) -> dict:
        """Get resource usage statistics for a container."""
        
        container = self.containers.get(terminal_id)
        if not container:
            return {}
        
        try:
            stats = container.stats(stream=False)
            
            # Calculate CPU usage percentage
            cpu_delta = stats['cpu_stats']['cpu_usage']['total_usage'] - \
                       stats['precpu_stats']['cpu_usage']['total_usage']
            system_delta = stats['cpu_stats']['system_cpu_usage'] - \
                          stats['precpu_stats']['system_cpu_usage']
            
            cpu_percent = 0.0
            if system_delta > 0:
                cpu_percent = (cpu_delta / system_delta) * 100.0
            
            # Calculate memory usage
            memory_usage = stats['memory_stats']['usage']
            memory_limit = stats['memory_stats']['limit']
            memory_percent = (memory_usage / memory_limit) * 100.0
            
            return {
                'cpu_percent': round(cpu_percent, 2),
                'memory_usage': memory_usage,
                'memory_limit': memory_limit,
                'memory_percent': round(memory_percent, 2),
                'network_rx': stats['networks']['eth0']['rx_bytes'],
                'network_tx': stats['networks']['eth0']['tx_bytes']
            }
            
        except (docker.errors.APIError, KeyError) as e:
            return {'error': str(e)}
    
    def cleanup_container(self, terminal_id: str):
        """Clean up a container when the terminal session ends."""
        
        container = self.containers.get(terminal_id)
        if container:
            try:
                container.stop(timeout=10)
                container.remove()
                del self.containers[terminal_id]
            except docker.errors.APIError as e:
                print(f"Error cleaning up container {terminal_id}: {e}")
    
    def cleanup_idle_containers(self):
        """Background thread to clean up idle containers."""
        
        while True:
            try:
                current_time = time.time()
                idle_containers = []
                
                for terminal_id, container in self.containers.items():
                    try:
                        # Check if container has been idle for more than 1 hour
                        container.reload()
                        if container.status == 'running':
                            stats = container.stats(stream=False)
                            # Implement idle detection logic based on CPU usage
                            # This is a simplified example
                            continue
                        else:
                            idle_containers.append(terminal_id)
                    except docker.errors.NotFound:
                        idle_containers.append(terminal_id)
                
                for terminal_id in idle_containers:
                    self.cleanup_container(terminal_id)
                
                time.sleep(300)  # Check every 5 minutes
                
            except Exception as e:
                print(f"Error in cleanup thread: {e}")
                time.sleep(60)  # Wait 1 minute before retrying
```

This comprehensive technical implementation provides your development team with detailed code examples and architectural patterns that can be directly implemented using the specified tools. The code examples demonstrate how to implement the dual-terminal functionality, MCP protocol integration, and containerized runtime management while following security best practices and performance optimization techniques.

