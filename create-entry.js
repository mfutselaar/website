// Get today's date
import * as fs from "node:fs";

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(today.getDate()).padStart(2, '0');
const dateStr = `${year}-${month}-${day}`;

const filename = `./src/_posts/${dateStr}.md`;
const content = `---
layout: post.njk # Don't touch
title: 
date: ${dateStr}
tags:
#  - coding
#  - php
#  - c-sharp
#  - cpp
#  - c
#  - personal
#  - photography
#previewLimit: 1  # Change to the number of paragraphs you want to display in the small component
#excerpt: |
#   Some excerpt
permalink: "{{ title | createPath(date) }}" # Don't touch dos
---
Content!
`;
fs.writeFileSync(filename, content, "utf8");

console.log(`Created new post: ${filename}`);
