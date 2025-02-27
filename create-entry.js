// Get today's date
import * as fs from "node:fs";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(today.getDate()).padStart(2, '0');
const dateStr = `${year}-${month}-${day}`;

const filename = `./src/blog/${dateStr}.md`;
const content = `---
title: Your Post Title
date: ${dateStr}
tags: blog
---
Your content here...
`;
fs.writeFileSync(filename, content, "utf8");

console.log(`Created new post: ${filename}`);
