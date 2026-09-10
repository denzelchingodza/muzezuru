# Prompt for the other Muzezuru session: facts grounding layer

Copy everything below the line and paste it as your next message in that session.

---

Next thing I want to build: a facts grounding layer to cut down hallucination on a specific, bounded set of questions, Shona proverbs (tsumo) and their meanings, idioms (madimikira) and their meanings, and animal names in Shona and English. Fine tuning with QLoRA mostly taught the model style, not new facts, so on factual questions it often answers fluently but wrong. Rather than trying to fix that generally, I want to fix it for exactly these categories, since they're a small, curatable set.

Here's the plan:

1. A curated dataset, data/shona-facts.json, where each entry has a category (proverb, idiom, animal, fact), one or more trigger keywords or phrasings in Shona and English, and the correct answer. Ask me first whether I already have this list ready. If I don't, draft a solid starter set of well known proverbs, idioms, and animal names, and clearly flag anything you're not fully certain about so I can verify before we ship it.

2. A matching step in the frontend, before a message goes to the Space. Check the user's message against the dataset first: plain keyword or substring matching for exact terms, plus fuzzy matching for typos and paraphrasing using a small free library like Fuse.js. No server or API needed for this.

3. On a match: for simple one word lookups like an animal name, just return the curated answer directly. For anything that should read like a sentence, pass the matched fact into the message sent to the Space as grounding context, something like "Fact: [x]. Answer the user's question in Shona using this fact," so it's phrased naturally but anchored to something true instead of the model's memory.

4. On no match, fall through to exactly the existing behavior, unchanged, disclaimer and all.

5. Update the homepage's suggested prompt chips to pull from this dataset, so visitors are nudged toward questions the app will reliably get right.

Same constraints as always: zero budget, no paid infra, no new backend server, everything fits inside the existing Next.js app. Ship it as a few clearly separated commits, and give me the exact git commands to run myself.
