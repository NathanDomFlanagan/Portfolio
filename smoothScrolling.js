// Select all links with a href attribute
const links = document.querySelectorAll('a[href^="#"]');

// Add an event listener to each link
links.forEach((link) => {
  link.addEventListener('click', (e) => {
    // Prevent default link behavior
    e.preventDefault();

    // Get the target element
    const target = document.querySelector(link.getAttribute('href'));

    // Smoothly scroll to the target element
    target.scrollIntoView({ behavior: 'smooth' });
  });
});