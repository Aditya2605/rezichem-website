# Local Setup Guide — macOS + VS Code

Follow these steps exactly. The whole setup takes about 5 minutes.

---

## Step 1 — Install prerequisites

Open **Terminal** (Cmd+Space → "Terminal") and run each block one at a time.

### Check if Node.js is installed
```bash
node --version
```
If you see `v18` or higher, skip to Step 2.

If not, install Node.js via the official installer:
→ https://nodejs.org (download the **LTS** version)

Or, if you have Homebrew:
```bash
brew install node
```

### Verify npm is available
```bash
npm --version
```
You should see version `9` or higher.

---

## Step 2 — Open the project in VS Code

1. Unzip `rezichem-healthcare.zip` to a location you prefer, e.g. `~/Projects/rezichem-healthcare`

2. Open VS Code

3. Go to **File → Open Folder** and select the `rezichem-healthcare` folder

   Or from Terminal:
   ```bash
   cd ~/Projects/rezichem-healthcare
   code .
   ```

---

## Step 3 — Install recommended VS Code extensions

When VS Code opens the project, it may prompt you to install recommended extensions.
Accept, or install manually:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`)
- **Prettier** (`esbenp.prettier-vscode`) — optional but helpful

---

## Step 4 — Set up the environment file

In VS Code, open the **Terminal** (`` Ctrl+` `` or **Terminal → New Terminal**).

```bash
cp .env.example .env.local
```

The default `.env.local` already has the right values for local development:
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

You do **not** need a database to run the site — it uses built-in mock data.

---

## Step 5 — Install dependencies

In the VS Code Terminal:

```bash
npm install
```

This takes 1–2 minutes and creates the `node_modules` folder.
You will see a progress bar and then a summary like `added 312 packages`.

---

## Step 6 — Start the dev server

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.3
- Local:        http://localhost:3000
- Environments: .env.local
✓ Ready in 2.3s
```

---

## Step 7 — Open in browser

Visit → **http://localhost:3000**

The Rezichem Healthcare website is now running locally.

---

## All available pages

| URL | Page |
|---|---|
| http://localhost:3000 | Home |
| http://localhost:3000/products | Products (category grid + search) |
| http://localhost:3000/products/antibacterial | Antibacterial category |
| http://localhost:3000/products/antibacterial/rezifix-200 | Product detail |
| http://localhost:3000/about | About |
| http://localhost:3000/careers | Careers |
| http://localhost:3000/contact | Contact |
| http://localhost:3000/admin | Admin portal |

---

## Troubleshooting

### `npm install` fails with permission errors
```bash
sudo chown -R $(whoami) ~/.npm
npm install
```

### Port 3000 is already in use
```bash
npm run dev -- -p 3001
```
Then open http://localhost:3001

### `next` command not found
```bash
npx next dev
```

### Module not found errors
Make sure you are in the project root (the folder containing `package.json`):
```bash
ls package.json   # should print: package.json
npm install       # reinstall
npm run dev
```

### Images not loading
The site loads images from Unsplash (requires internet). If you're offline, you'll see the placeholder icon instead — this is expected and won't break anything.

---

## Making code changes

The dev server has **hot reload** — save any file and the browser updates instantly.

Key files to edit:

| What to change | File |
|---|---|
| Company name, address, phone | `src/components/layout/Footer.tsx` |
| Navigation links | `src/components/layout/Header.tsx` |
| Hero headline & buttons | `src/app/page.tsx` |
| Product data | `src/lib/mockData.ts` |
| Colors / fonts | `tailwind.config.ts` + `src/styles/globals.css` |
| SEO title & description | `src/app/layout.tsx` |

---

## Stopping the server

Press `Ctrl+C` in the Terminal.
