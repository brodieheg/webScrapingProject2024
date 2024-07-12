// fetches the data from url
// won't work on client-rendered components
// it loops the array of keywords and looks for matches, if found, returns true
// it uses regex to search for hrefs,
// utils.ts file to store basic utility functions
// look into searching by html element and getting it from there

// setup function (non-recursive) that initializes the recursion
import fetch from "node-fetch";

export const searchForUrls: any = async (
  baseUrl: string,
  keywords: string[]
) => {
  // Search for internal URL's and format them
  if (await searchForKeywords(baseUrl, keywords[0])) {
    return baseUrl;
  }
  const text = await fetch(baseUrl).then(async (response) => {
    return response.text();
  });

  const hrefRegex: RegExp = /href="(?:[^"\\]|\\.)*"/g;
  // Find all matches of href attributes
  const hrefMatches: string[] | null = text.match(hrefRegex);

  if (hrefMatches) {
    // Iterate over matches and extract subdomains
    const subdomains = hrefMatches.map((match) => {
      let hrefAttribute: string = match.slice(6, -1); // Remove 'href="' and '"'
      if (
        // identifies internal links
        hrefAttribute.includes(baseUrl) ||
        hrefAttribute.charAt(0) === "/"
      ) {
        let newHrefAttribute: string;
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
      return isValidUrl(href);
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
  baseUrl: string,
  keyword: string
): Promise<boolean> => {
  const text = await fetch(baseUrl).then(async (response) => {
    return response.text();
  });
  if (text.includes(keyword)) {
    return true;
  }
  return false;
};

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};
