# VFLOW
VFLOW is a node-based AI workflow builder that enables you to create, customize, and reuse AI-powered workflows entirely in your browser. Connect prompts, AI models, and data processing nodes to build powerful automation flows without writing code.

![VFLOW Logo](/public/favicon.png)

## ✨ Features

- **Drag-and-Drop Interface**: Intuitive workflow builder powered by React Flow
- **Multiple Node Types**: Prompt, AI, Markdown, Annotation, and Error nodes
- **Multi-Provider LLM Support**: Connect to OpenAI, Anthropic, Google, Groq, xAI, and OpenRouter
- **Local-First**: All workflows and API keys stored securely in your browser's localStorage
- **Template Library**: Get started quickly with pre-built workflow templates
- **Import/Export**: Share workflows as JSON files or import existing ones
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Real-time Execution**: Run workflows and see results instantly

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- API keys for your preferred LLM providers (optional for initial exploration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vflow.git
   cd vflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### Usage

1. **Create a New Workflow**:
   - Click "+ New Workflow" in the sidebar
   - Give your workflow a name

2. **Add Nodes**:
   - Use the floating "+" button or sidebar to add nodes
   - Available node types:
     - **Prompt Node**: Input text or prompts
     - **AI Node**: Process prompts with LLMs (requires API key)
     - **Markdown Node**: Display formatted output
     - **Annotation Node**: Add notes and documentation
     - **Error Node**: Shows validation errors

3. **Configure Nodes**:
   - Click on any node to open its configuration panel
   - Set prompts, select models, adjust parameters

4. **Connect Nodes**:
   - Drag from output ports to input ports to create connections
   - Build chains of processing steps

5. **Run Your Workflow**:
   - Click the "▶️ Run" button in the top toolbar
   - Watch as data flows through your nodes
   - View results in Markdown nodes

6. **Manage API Keys**:
   - Access via sidebar ⚙️ Settings → API Keys
   - Add keys for providers you want to use
   - Keys are stored locally in your browser

7. **Save & Share**:
   - Workflows auto-save to localStorage
   - Export as JSON via the menu (⋯ → Export)
   - Import workflows from JSON files

## 🧩 Node Types

### Prompt Node
Input node for text prompts with optional labeling. Use to start workflows or inject static text.

### AI Node
Core processing node that connects to various LLM providers:
- **Providers**: OpenAI, Anthropic, Google, Groq, xAI, OpenRouter
- **Features**: System prompts, model selection, temperature control, reasoning toggle (where supported)
- **Requires**: Valid API key for selected provider

### Markdown Node
Output node that renders markdown with additional features:
- Copy to clipboard button
- Toggle between rendered view and raw/code view
- Supports GitHub Flavored Markdown

### Annotation Node
Free-form text node for adding documentation, notes, or comments within your workflows.

### Error Node
Internal component that displays validation errors when node data is invalid or missing required fields.

## 🤖 Supported AI Providers

VFLOW integrates with the Vercel AI SDK to support these providers:

| Provider | Popular Models | Notes |
|----------|----------------|-------|
| **OpenAI** | GPT-4o, GPT-4o mini, o1, o3 series | Industry leader |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus | Strong reasoning |
| **Google** | Gemini 1.5 Pro, Gemini 1.5 Flash | Multimodal capable |
| **Groq** | Llama 3, Mixtral, DeepSeek R1 | Extremely fast inference |
| **xAI** | Grok models | Latest from xAI |
| **OpenRouter** | Hundreds of models | Aggregator service |

API keys are stored locally and never sent to any server.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) built on [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmndrs/) with persistence
- **Workflow Engine**: [React Flow](https://reactflow.dev/) (@xyflow/react)
- **AI Integration**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **Icons**: [Remix Icon](https://remixicon.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Charts**: [Recharts](https://recharts.org/en-US/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/)

## 📁 Project Structure

```
vflow/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── nodes/              # Workflow node implementations
│   ├── ui/                 # shadcn/ui components
│   ├── workflow.tsx        # Main React Flow canvas
│   ├── app-sidebar.tsx     # Sidebar with workflow management
│   └── panels.tsx          # Floating action panels
├── lib/                    # State stores and utilities
│   ├── workflow-store.ts   # Zustand store for workflows
│   ├── api-key-store.ts    # Zustand store for API keys
│   ├── ai.ts               # AI provider configurations
│   └── templates.ts        # Built-in workflow templates
├── hooks/                  # Custom React hooks
├── public/                 # Static assets
└── styles/                 # Global CSS styles
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

VFLOW uses client-side storage only, so no server-side environment variables are required for core functionality. However, for analytics:

- `POSTHOG_KEY` - PostHog analytics key (optional)
- `POSTHOG_HOST` - PostHog host (optional)

## 📚 Documentation

For more detailed information, see:

- [Node Reference](docs/nodes.md) - Detailed node specifications
- [AI Provider Setup](docs/ai-providers.md) - Guide to configuring LLM providers
- [Workflow Templates](docs/templates.md) - Overview of built-in templates
- [Keyboard Shortcuts](docs/shortcuts.md) - Productivity tips

*Note: Documentation files are placeholders - contribute to help build them!*

## 🤝 Contributing

We welcome contributions to make VFLOW better! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on:

- Reporting bugs
- Suggesting features
- Submitting pull requests
- Development setup
- Coding standards

**Note**: CONTRIBUTING.md is currently a placeholder - help us create it!

### Contribution Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙋‍♂️ Support

- **Documentation**: Check the docs/ directory (in progress)
- **Issues**: Report bugs or request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) for LLM integrations
- [React Flow](https://reactflow.dev/) for the workflow engine
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Zustand](https://zustand-demo.pmndrs/) for state management

---

Built with ❤️ for developers, creators, and anyone who wants to harness AI without complexity.

**VFLOW** - Where AI workflows come to life.