// Brute force method to redirect to new domain while keeping the pathname
// 404 is bad for SEO
// TODO: Figure out a smart method to redirect from the main branch instead of hack like this
const parsedUrl = new URL(window.location.href);

window.location.replace(
  // "/regunakyle" is 11 characters long
  `https://www.ericleung.dev${parsedUrl.pathname.substring(11)}${
    parsedUrl.search
  }`
);
