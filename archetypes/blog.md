---
title: {{ replace .File.ContentBaseName "-" " " | title | jsonify }}
date: {{ .Date }}
draft: true
tags: []
previewLimit: 1
# excerpt: "An optional custom excerpt."
# slug: "An optional permanent URL slug."
---
