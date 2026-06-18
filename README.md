# 💸 Splitex

> **Split bills fairly, settle up instantly.**

Splitex is a lightweight, no-login bill-splitting app built for groups. Create a group, add people, log shared expenses, assign who owes what — and instantly see a clean settlement summary. All data stays in your browser, so it's fast, private, and works without an internet connection.

Perfect for trips, dinners, flatmates, and any shared expense situation.

---

## ✨ Features

- 👥 **Group Management** — Create and manage multiple groups (trips, flatmates, events)
- 🧾 **Expense Logging** — Add items and assign them to specific people or split equally
- 💰 **Tip & Tax Support** — Add tip percentage and tax to the bill automatically
- 🌍 **Multi-Currency** — Switch between currencies for international trips
- 📊 **Smart Settlement** — Auto-calculates the minimum number of payments to settle up
- 🌙 **Dark / Light Mode** — Sleek theme toggle with your preference saved automatically
- 💾 **No Account Needed** — All data stored locally in your browser (localStorage)
- ⚡ **Blazing Fast** — Built with React + Vite for instant load times

---

## 🚀 How It Works

Splitex walks you through 4 simple steps:

```
Step 1 → Add People       (who's in the group?)
Step 2 → Add Items        (what did you spend on?)
Step 3 → Tip & Tax        (any extras to add?)
Step 4 → Settlement       (who pays who?)
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| Vanilla CSS | Styling & animations |
| localStorage | Data persistence |

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/your-username/splitex.git
cd splitex

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

---

## 🌐 Live Link

https://splitex-bill-spliting-app.vercel.app/

---

## 📁 Project Structure

```
splitex/
├── src/
│   ├── components/       # UI components (Header, Footer, Steps, etc.)
│   ├── hooks/            # Custom React hooks (useBillStore, useCalculator)
│   ├── App.jsx           # Root component & routing logic
│   └── App.css           # Global styles
├── public/               # Static assets
├── index.html            # Entry HTML
└── vite.config.js        # Vite configuration
```

---

## 📝 Notes

- Data is stored in `localStorage` — it's private to each user's browser
- No backend, no database, no sign-up required
- Each person who opens the app on their own device starts fresh

---

## 👤 Author

**Saksham**
📧 [saksham648@gmail.com](mailto:saksham648@gmail.com)

---

## 📄 License

MIT — free to use, modify, and distribute.
