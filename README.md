# AI Peer Review

> A multi-model AI platform that generates code from a plain English description, then has two AI models independently peer-review it in parallel.

---

## What It Does

You describe what you want to build — in plain language — and the app orchestrates three AI models to collaborate on it in three different ways:

*1 - Review Mode:*
   - Model A acts as the fast coder and generates the initial code based on your prompt.
   - Model B acts as the senior reviewer, watches the generated code, points out any flaws, and provides a corrected version.

*2 - Companion Mode:*
   - Model A acts as the software architect, reasoning about the problem and providing a clear, step-by-step architecture plan.
   - Model B acts as the developer and implements the actual code based on the provided plan.

*3 - Challenge Mode:*
   - Both models compete concurrently to build the best possible code for your request.
   - Once they finish, the app displays their responses side-by-side along with basic parameters like Response Time, Code Length (characters), and Primary Language, allowing you to decide which one performed better.

All three models run with no backend — everything happens directly in your browser.

You can freely choose which model plays which role. Supported models:

| Model | Provider |
|---|---|
| Gemini 2.0 Flash | Google |
| GPT-4o | OpenAI |
| Claude 3.5 Sonnet | Anthropic |

---

## Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- At least one API key (you need your own — see below)

### Installation

```bash
git clone https://github.com/lucadilo/ai-peer-review.git
cd ai-peer-review
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Keys

This app calls AI provider APIs **directly from the browser** using your own keys. No key is ever stored or sent anywhere other than the respective AI provider's API endpoint.

Get your keys here:
- **Gemini** → [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- **ChatGPT** → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Claude** → [console.anthropic.com](https://console.anthropic.com/)

> You only need **one key** to use the app — just assign the same model to all three roles.  
> Keys are entered in the browser UI and cleared on page refresh.

---

## Deploy on Vercel

Since the app is a pure frontend (no backend), you can deploy it for free on [Vercel](https://vercel.com) in one click:

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your `ai-peer-review` repository
4. Vercel auto-detects Vite — click **Deploy**
5. Your app is live at `https://your-project.vercel.app`

> Netlify works the same way — just drag and drop the `dist/` folder after running `npm run build`.

---

## Project Structure

```
ai-peer-review/
├── index.html          # Entry point
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite config
├── tsconfig.json       # TypeScript config
└── src/
    ├── main.tsx        # React root
    └── App.tsx         # Full app — UI + API calls
```

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 6 |
| Styling | Tailwind CSS |
| Code highlight | `react-syntax-highlighter` |
| Markdown | `react-markdown` |
| AI APIs | Direct `fetch` calls (no SDK, no backend) |

---

## Contributing

Everyone is welcome to fork this project and modify it however they like.

**One rule: do not push directly to `main`.**

The workflow is:

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/ai-peer-review.git

# 2. Create a new branch for your changes
git checkout -b feature/my-awesome-change

# 3. Make your changes, commit, and push
git add .
git commit -m "feat: describe your change"
git push origin feature/my-awesome-change

# 4. Open a Pull Request from your branch → main
```

Ideas for contributions:
- Add support for new AI models
- Add session history / local storage persistence
- Add an export button to download generated files as a ZIP
- Add a synthesis step that merges the two reviews into a final improved version

---

## License

This project is licensed under the **GNU Affero General Public License v3 (AGPL v3)** for personal, educational, and open-source use.

**Commercial use requires a separate license agreement.**  
If you intend to use this software in a commercial product, SaaS platform, or any for-profit context, please read [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md) and get in touch.

Free to use if you are:
- Working on a personal project
- Using it for educational or research purposes
- Contributing to an open-source project licensed under AGPL v3

See [LICENSE](LICENSE) for the full terms.
