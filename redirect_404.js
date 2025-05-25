// Brute force method to redirect to new domain while keeping the pathname
// 404 is bad for SEO
// TODO: Figure out a smart method to redirect from the main branch instead of hack like this
const parsedUrl = new URL(window.location.href);
const fullPathname = `${parsedUrl.pathname.substring(11)}${parsedUrl.search}`;

// If somehow not redirected, set the href of the link to the correct path
document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("redirect-link");
  if (link) {
    link.href = `https://www.ericleung.dev${fullPathname}`;
  }
});

window.location.replace(
  // "/regunakyle" is 11 characters long
  `https://www.ericleung.dev${fullPathname}`
);
