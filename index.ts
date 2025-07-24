import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../../public')));

// Dummy email data
const emails = [
  {
    from: "user@example.com",
    subject: "Meeting Schedule",
    folder: "Inbox",
    category: "Meeting Booked",
    account: "work@example.com"
  },
  {
    from: "noreply@spam.com",
    subject: "You won!",
    folder: "Spam",
    category: "Spam",
    account: "personal@example.com"
  },
  {
    from: "friend@example.com",
    subject: "Catch up soon!",
    folder: "Inbox",
    category: "Interested",
    account: "personal@example.com"
  }
];

// Filters route
app.get('/filters', (req, res) => {
  const accounts = [...new Set(emails.map(e => e.account))];
  const folders = [...new Set(emails.map(e => e.folder))];
  res.json({ accounts, folders });
});

// Emails route
app.get('/emails', (req, res) => {
  const { account, folder, q } = req.query;
  let filtered = emails;

  if (account) filtered = filtered.filter(e => e.account === account);
  if (folder) filtered = filtered.filter(e => e.folder === folder);
  if (q) {
    const query = (q as string).toLowerCase();
    filtered = filtered.filter(e =>
      e.subject.toLowerCase().includes(query) ||
      e.from.toLowerCase().includes(query)
    );
  }

  res.json(filtered);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
