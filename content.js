function addNavbarText() {
    const navbarBrand = document.querySelector('a.navbar-brand');
    if (navbarBrand && !navbarBrand.querySelector('.custom-logo-text')) {
        const newText = document.createElement('span');
        newText.className = 'custom-logo-text';
        newText.textContent = 'Atilim University';
        navbarBrand.appendChild(newText);
    }
}

function getCourseIdFromUrl() {
    const bodyId = document.body.id;
    if (bodyId.startsWith('page-course-view')) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }
    const courseLink = document.querySelector('.breadcrumb a[href*="/course/view.php"]');
    if (courseLink) {
        const urlParams = new URLSearchParams(courseLink.search);
        return urlParams.get('id');
    }
    const contextHeader = document.querySelector('[data-activityname]');
    if (contextHeader && contextHeader.closest('[data-course-id]')) {
        return contextHeader.closest('[data-course-id]').dataset.courseId;
    }
    return null;
}

let ICON_CACHE = null;

async function initializeIconCache(courseId) {
    const storageKey = `course_icons_${courseId}`;
    try {
        const data = await chrome.storage.local.get(storageKey);
        if (data[storageKey]) {
            ICON_CACHE = data[storageKey];
        }
    } catch (error) {
        console.log("Could not load icon cache during navigation, will build if possible.");
    }

    if (window.location.pathname.includes('/course/view.php')) {
        setTimeout(() => {
            const activities = document.querySelectorAll('li.activity[id^="module-"]');
            if (activities.length === 0) return;

            let iconMap = {};
            const categories = ['assessment', 'content', 'collaboration', 'communication', 'administration', 'other', 'interactivecontent'];
            activities.forEach(activity => {
                const activityId = activity.id.replace('module-', '');
                const iconContainer = activity.querySelector('.activityiconcontainer');
                const sourceIcon = iconContainer ? iconContainer.querySelector('.activityicon') : null;
                if (activityId && sourceIcon && iconContainer) {
                    const category = categories.find(c => iconContainer.classList.contains(c));
                    iconMap[activityId] = { src: sourceIcon.src, category: category || 'other' };
                }
            });
            
            ICON_CACHE = iconMap;
            chrome.storage.local.set({ [storageKey]: iconMap });
        }, 1000);
    }
}

function applyIconsFromCache() {
    if (!ICON_CACHE) return;

    const indexItems = document.querySelectorAll('.courseindex-item[data-id]:not(.icons-added)');
    if (indexItems.length === 0) return;

    indexItems.forEach(item => {
        item.classList.add('icons-added');
        const activityId = item.dataset.id;
        const iconData = ICON_CACHE[activityId];
        
        if (activityId && iconData) {
            if (item.querySelector('.courseindex-item-icon-container')) return;
            if (iconData.category) item.classList.add(iconData.category);
            
            const container = document.createElement('span');
            container.className = 'courseindex-item-icon-container';
            const newIcon = document.createElement('img');
            newIcon.className = 'courseindex-item-icon';
            newIcon.src = iconData.src;
            container.appendChild(newIcon);
            item.prepend(container);
        }
    });
}

function makeDrawerTitleClickable() {
    const drawerHeader = document.querySelector('[data-drawer="courseindex"] .drawerheader:not(.title-link-added)');
    if (!drawerHeader) return;
    drawerHeader.classList.add('title-link-added');
    
    const headingSpan = drawerHeader.querySelector('.courseindexheading');
    const courseId = getCourseIdFromUrl(); 
    
    if (headingSpan && courseId) {
        const link = document.createElement('a');
        link.href = `/course/view.php?id=${courseId}`;
        link.className = 'courseindex-heading-link';
        link.textContent = headingSpan.textContent;
        headingSpan.textContent = '';
        headingSpan.appendChild(link);
    }
}

(async function() {
    addNavbarText();

    const courseId = getCourseIdFromUrl();
    if (courseId) {
        await initializeIconCache(courseId);
    }
    
    const observer = new MutationObserver(() => {
        applyIconsFromCache();
        makeDrawerTitleClickable();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
        applyIconsFromCache();
        makeDrawerTitleClickable();
    }, 500);
})();