// fetches the data from url
// won't work on client-rendered components
// it loops the array of keywords and looks for matches, if found, returns true
// it uses regex to search for hrefs,
// utils.ts file to store basic utility functions
// look into searching by html element and getting it from there

// setup function (non-recursive) that initializes the recursion
import fetch from "node-fetch";

export const searchForUrls = async (
  baseUrl,
  keywords
) => {
  if (!isValidUrl(baseUrl)) {
    throw new Error("Invalid URL");
  }
  // Search for internal URL's and format them
  if (await searchForKeywords(baseUrl, keywords[0])) {
    return baseUrl;
  }
  const text = await fetch(baseUrl).then(async (response) => {
    return response.text();
  });

  const hrefRegex = /href="(?:[^"\\]|\\.)*"/g;
  // Find all matches of href attributes
  const hrefMatches = text.match(hrefRegex);

  if (hrefMatches) {
    // Iterate over matches and extract subdomains
    const subdomains = hrefMatches.map((match) => {
      let hrefAttribute = match.slice(6, -1); // Remove 'href="' and '"'
      if (
        // identifies internal links
        hrefAttribute.includes(baseUrl) ||
        hrefAttribute.charAt(0) === "/"
      ) {
        let newHrefAttribute;
        if (
          // formats url, accounting for double slash possibility
          hrefAttribute.charAt(0) === "/" &&
          baseUrl.charAt(baseUrl.length - 1) === "/"
        ) {
          newHrefAttribute = hrefAttribute.substring(1);
        } else {
          newHrefAttribute = hrefAttribute;
        }
        if (newHrefAttribute.includes(baseUrl)) {
          return newHrefAttribute;
        } else {
          return baseUrl + newHrefAttribute;
        }
      }
    });

    // Remove empty strings and duplicates
    // keep this as a set, don't make array
    const validSubDomains = subdomains.filter((href) => {
      return (
        isValidUrl(href) &&
        (href.includes("careers") ||
          href.includes("about") ||
          href.includes("benefits"))
      );
    });
    for (let index = 0; index < validSubDomains.length; index++) {
      const subdomain = validSubDomains[index];
      console.log(subdomain);
      if (await searchForKeywords(subdomain, keywords[0])) {
        console.log("found it!" + keywords[0]);
        return subdomain;
      }
    }
  }
  return false;
};

const searchForKeywords = async (
  baseUrl,
  keyword
) => {
  const text = await fetch(baseUrl).then(async (response) => {
    return response.text();
  });
  if (text.includes(keyword)) {
    return true;
  }
  return false;
};

const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};
