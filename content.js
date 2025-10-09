// adding text instead of logo
function addNavbarText() {
  const navbarBrand = document.querySelector('a.navbar-brand');
  if (navbarBrand && !navbarBrand.querySelector('.custom-logo-text')) {
    const newText = document.createElement('span');
    newText.className = 'custom-logo-text';
    newText.textContent = 'Atilim University';
    navbarBrand.appendChild(newText);
  }
}
addNavbarText();

// adding icons to course index
function addIconsToCourseIndex() {
  const indexItems = document.querySelectorAll('.courseindex-item[data-id]:not(.icons-added)');
  if (indexItems.length === 0) {
    return;
  }
  indexItems.forEach(item => {
    item.classList.add('icons-added');
    const activityId = item.dataset.id;
    if (!activityId) return;
    const mainActivityElement = document.getElementById('module-' + activityId);
    if (!mainActivityElement) return;
    const sourceIcon = mainActivityElement.querySelector('.activityicon');
    if (!sourceIcon) return;
    const computedStyle = window.getComputedStyle(sourceIcon);
    const iconFilterStyle = computedStyle.getPropertyValue('filter');
    const iconContainer = document.createElement('span');
    iconContainer.className = 'courseindex-item-icon-container';
    const newIcon = document.createElement('img');
    newIcon.className = 'courseindex-item-icon';
    newIcon.src = sourceIcon.src;
    newIcon.alt = sourceIcon.alt;
    newIcon.style.filter = iconFilterStyle;
    iconContainer.appendChild(newIcon);
    item.prepend(iconContainer);
  });
}
const masterObserver = new MutationObserver(() => {
    addIconsToCourseIndex();
});
masterObserver.observe(document.body, {
  childList: true,
  subtree: true
});
addIconsToCourseIndex();