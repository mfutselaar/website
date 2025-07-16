// File: eleventy.config.js
import eleventyNavigationPlugin from "@11ty/eleventy-navigation"
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight"
import htmlmin from "html-minifier-terser"
import readingTime from 'eleventy-plugin-reading-time'

export default async function (eleventyConfig) {
    const nth = (d) => {
        if (d > 3 && d < 21) return "th"
        switch (d % 10) {
            case 1:
                return "st"
            case 2:
                return "nd"
            case 3:
                return "rd"
            default:
                return "th"
        }
    }

    const tagDictionary = {
        'c-sharp': 'C#',
        'cpp': 'C++'
    }

    eleventyConfig.addPlugin(eleventyNavigationPlugin)
    eleventyConfig.addPlugin(syntaxHighlight, {
        // preAttributes: {
        //     class: 'line-numbers',
        // }
    })

    eleventyConfig.addPlugin(readingTime);

    eleventyConfig.addPassthroughCopy("src/js")
    eleventyConfig.addPassthroughCopy("src/img")

    eleventyConfig.ignores.add("src/index.html")

    const createPath = function (title, date) {
        let year = date.getFullYear()
        let month = ("0" + (date.getMonth() + 1)).slice(-2)
        let day = ("0" + (date.getDate())).slice(-2)

        const slug = (title || "").toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "")

        return `/blog/${year}/${month}/${day}/${slug}/index.html`
    }

    eleventyConfig.addFilter("createPath", createPath)

    eleventyConfig.addFilter("translateTag", function (tag) {
        console.log(tag, tagDictionary, tagDictionary[tag] || tag)
        return tagDictionary[tag] || tag;
    })

    eleventyConfig.addFilter("datePart", function (date, part) {
        date = new Date(date)

        switch (part) {
            case "y":
                return new Date(date).getFullYear()
            case "m":
                return ("0" + (date.getMonth() + 1)).slice(-2)
            case "d":
                return ("0" + (date.getDate())).slice(-2)
        }
    })

    eleventyConfig.addFilter("buildArchivePath", function (date, type = "day") {
        let year = date.getFullYear()
        let month = ("0" + (date.getMonth() + 1)).slice(-2)
        let day = ("0" + (date.getDate())).slice(-2)

        let path = "/blog/"
        if (type === "year") {
            path += `${year}/index.html`
        } else if (type === "month") {
            path += `${year}/${month}/index.html`
        } else {
            path += `${year}/${month}/${day}/index.html`
        }
        return path
    })

    eleventyConfig.addFilter("excerpt", function (post) {
        if (post.data.excerpt !== undefined) {
            return "<p>" + post.data.excerpt + "</p>"
        }

        const previewLimit = post.data.previewLimit || 1
        let content = post.content

        const paragraphs = content.split("</p>")

        let response = ""
        for (let i = 0; i < previewLimit; i++) {
            response += paragraphs[i].trim() + "</p>"
        }

        return response
    })

    eleventyConfig.addFilter("dateReadable", function (date, part) {
        if (date === undefined || date === null) {
            return ""
        }

        if (typeof (date) === "string") {
            date = new Date(date)
        }

        const month = date.toLocaleDateString("en-US", {month: "long"})
        const month_padded = date.toLocaleDateString("en-US", {month: "2-digit"})
        const month_normal = date.toLocaleDateString("en-US", {month: "numeric"})
        const year = date.toLocaleDateString("en-US", {year: "numeric"})
        const weekday = date.toLocaleDateString("en-US", {weekday: "long"})
        const day = date.toLocaleDateString("en-US", {day: "numeric"})
        const day_padded = date.toLocaleDateString("en-US", {day: "2-digit"})

        if (part === "m_short") {
            console.log(date, month)
        }

        switch (part) {
            case "short":
                return `${year}-${month_normal}-${day}`
            case "y":
                return year
            case "m_short":
                return month
            case "m":
                return month + ", " + year
            case "d":
                return weekday + ", " + month + " " + day + nth(day) + " " + year
            case "d_long":
                return weekday + " the " + day + nth(day)
            case "href":
                return `${weekday}, <a href="/blog/${year}/${month_padded}">${month}</a> <a href="/blog/${year}/${month_padded}/${day_padded}">${day}${nth(day)}</a> <a href="/blog/${year}">${year}</a>`
        }
    })

    eleventyConfig.addCollection("blogPosts", function (collectionApi) {
        return collectionApi.getFilteredByGlob("src/_posts/*.md").sort((a, b) => {
            // Custom sort function for DD-MM-YYYY
            return new Date(b.date) - new Date(a.date)
        }).map(item => {
            // Calculate the permalink and assign it to item.data.url
            item.data.url = createPath(item.data.title, item.data.date, item.data.date)
            item.data.origin = item.inputPath.replace('./src', '')

            return item
        })
    })

    eleventyConfig.addCollection("postsByYear", function (collectionApi) {
        const posts = collectionApi.getFilteredByGlob("src/_posts/*.md")
        const years = new Set()
        for (const post of posts) {
            years.add(post.data.date.getFullYear())
        }

        const yearCollections = {}
        for (const year of years) {
            yearCollections[year] = posts.filter(post => {
                return post.data.date.getFullYear() === year
            })
        }

        return yearCollections
    })

    eleventyConfig.addCollection("postsByYearMonth", function (collectionApi) {
        const posts = collectionApi.getFilteredByGlob("src/_posts/*.md")
        const yearMonths = new Set()

        for (const post of posts) {
            const month = post.data.date.getMonth() + 1
            const year = post.data.date.getFullYear()
            yearMonths.add(`${year}-${month}-01`)
        }

        const monthCollections = {}
        for (const yearMonth of yearMonths) {
            monthCollections[yearMonth] = posts.filter(post => {
                const month = post.data.date.getMonth() + 1
                const year = post.data.date.getFullYear()
                return `${year}-${month}-01` === yearMonth

            })
        }

        return monthCollections
    })

    eleventyConfig.addCollection("postByYearMonthDays", function (collectionApi) {
        const posts = collectionApi.getFilteredByGlob("src/_posts/*.md")
        const yearMonthDays = new Set()

        for (const post of posts) {
            const month = post.data.date.getMonth() + 1
            const year = post.data.date.getFullYear()
            const day = post.data.date.getDate()
            yearMonthDays.add(`${year}-${month}-${day}`)
        }

        const dayCollections = {}
        for (const yearMonthDay of yearMonthDays) {
            dayCollections[yearMonthDay] = posts.filter(post => {
                const month = post.data.date.getMonth() + 1
                const year = post.data.date.getFullYear()
                const day = post.data.date.getDate()
                return `${year}-${month}-${day}` === yearMonthDay
            })
        }

        return dayCollections
    })

    eleventyConfig.addCollection("tags", function (collectionApi) {
        const posts = collectionApi.getFilteredByGlob("src/_posts/*.md")
        const tags = new Set()
        console.log(posts)
        for (const post of posts) {
            if (post.data.tags) {
                post.data.tags.forEach(tag => tags.add(tag))
            }
        }
        const tagCollections = {}
        for (const tag of tags) {
            tagCollections[tag] = posts.filter(post => post.data.tags && post.data.tags.includes(tag))
        }

        return tagCollections
    })

    eleventyConfig.addTransform("htmlmin", function (c) {
        if ((this.page.outputPath || "").endsWith(".html")) {
            let minified = htmlmin.minify(c, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                preserveLineBreaks: true
            })

            return minified
        }

        return c
    })

    return {
        dir: {
            input: "src",
            output: "build",
            layouts: "_layouts",
            data: "_data",
            includes: "_includes"
        },
        templateFormats: ["md", "html", "njk"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    }
}