import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import * as path from "node:path";

export default function (eleventyConfig) {

    eleventyConfig.addPlugin(eleventyNavigationPlugin);
    eleventyConfig.addPlugin(syntaxHighlight);

    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/img");

    eleventyConfig.ignores.add("src/index.html");

    eleventyConfig.addCollection("blogPosts", function (collectionApi) {
        return collectionApi.getFilteredByGlob("**/blog/**/*.md").map(post => {
            // Extract date from filename
            const dateStr = path.basename(post.inputPath, ".md");
            const [year, month, day] = dateStr.split("-");

            // Generate slug from title (simple slugify function)
            const slug = post.data.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');

            // Create output path
            post.outputPath = `./build/blog/${year}/${month}/${day}/${slug}/index.html`;

            // Add layout to data
            post.data.layout = "base.njk";

            return post;
        });
    });


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
    };
};