/**
 * The Bearded Commentary - Ghost Theme JavaScript
 * Sola Scriptura Design - Navigation, search, and interactions
 */

(function() {
    'use strict';

    // ==========================================================================
    // Mobile Navigation
    // ==========================================================================

    const Navigation = {
        init() {
            const toggle = document.querySelector('.nav-toggle');
            const menu = document.querySelector('.nav-menu');

            if (!toggle || !menu) return;

            toggle.addEventListener('click', () => {
                const isOpen = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isOpen);
                menu.classList.toggle('is-open');
                document.body.style.overflow = isOpen ? '' : 'hidden';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (menu.classList.contains('is-open') &&
                    !menu.contains(e.target) &&
                    !toggle.contains(e.target)) {
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('is-open');
                    document.body.style.overflow = '';
                    toggle.focus();
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && menu.classList.contains('is-open')) {
                    toggle.setAttribute('aria-expanded', 'false');
                    menu.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            });
        }
    };

    // ==========================================================================
    // Search
    // ==========================================================================

    const Search = {
        init() {
            const searchToggle = document.querySelector('.search-toggle');
            const searchOverlay = document.querySelector('.search-overlay');
            const searchClose = document.querySelector('.search-close');
            const searchInput = document.querySelector('.search-input');
            const searchResults = document.querySelector('.search-results');

            if (!searchToggle || !searchOverlay) return;

            // Check if search is configured
            const isConfigured = typeof ghost !== 'undefined' && ghost.url && ghost.key;

            // Open search
            searchToggle.addEventListener('click', () => {
                searchOverlay.classList.add('is-open');
                searchInput.focus();
                document.body.style.overflow = 'hidden';

                // Show configuration message if not set up
                if (!isConfigured && !searchInput.value) {
                    this.showSetupMessage(searchResults);
                }
            });

            // Close search
            const closeSearch = () => {
                searchOverlay.classList.remove('is-open');
                document.body.style.overflow = '';
                searchInput.value = '';
                this.clearResults(searchResults);
            };

            searchClose.addEventListener('click', closeSearch);

            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) closeSearch();
            });

            document.addEventListener('keydown', (e) => {
                // Open search with cmd/ctrl + k
                if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                    e.preventDefault();
                    searchOverlay.classList.add('is-open');
                    searchInput.focus();
                    document.body.style.overflow = 'hidden';
                }

                // Close search with escape
                if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
                    closeSearch();
                }
            });

            // Initialize Ghost Content API search if available
            if (isConfigured) {
                this.initGhostSearch(searchInput, searchResults);
            }
        },

        clearResults(container) {
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
        },

        showSetupMessage(container) {
            this.clearResults(container);
            const messageDiv = document.createElement('div');
            messageDiv.className = 'search-setup-message';

            const title = document.createElement('p');
            const strong = document.createElement('strong');
            strong.textContent = 'Search needs to be configured.';
            title.appendChild(strong);

            const intro = document.createElement('p');
            intro.textContent = 'To enable search:';

            const list = document.createElement('ol');
            const steps = [
                'Go to Ghost Admin → Settings → Integrations',
                'Create a new Custom Integration',
                'Copy the Content API Key',
                'Go to Design → Site-wide → Content API key',
                'Paste the key and save'
            ];
            steps.forEach(step => {
                const li = document.createElement('li');
                li.textContent = step;
                list.appendChild(li);
            });

            messageDiv.appendChild(title);
            messageDiv.appendChild(intro);
            messageDiv.appendChild(list);
            container.appendChild(messageDiv);
        },

        showMessage(container, text, className) {
            this.clearResults(container);
            const p = document.createElement('p');
            p.className = className || '';
            p.textContent = text;
            container.appendChild(p);
        },

        initGhostSearch(input, results) {
            let debounceTimer;

            input.addEventListener('input', () => {
                clearTimeout(debounceTimer);
                const query = input.value.trim();

                if (query.length < 2) {
                    this.clearResults(results);
                    return;
                }

                // Show loading state
                this.showMessage(results, 'Searching...', 'search-loading');

                debounceTimer = setTimeout(() => {
                    this.performSearch(query, results);
                }, 300);
            });
        },

        async performSearch(query, results) {
            try {
                // Encode the query for safe URL usage
                const encodedQuery = encodeURIComponent(query);

                const response = await fetch(
                    `${ghost.url}/ghost/api/content/posts/?key=${ghost.key}&limit=10&fields=title,url,excerpt,feature_image,published_at&order=published_at%20desc&filter=title:~'${encodedQuery}'`
                );

                if (!response.ok) throw new Error('Search failed');

                const data = await response.json();
                this.renderResults(data.posts, results, query);
            } catch (error) {
                console.error('Search error:', error);
                this.showMessage(results, 'Search is currently unavailable. Please try again later.', 'search-error');
            }
        },

        renderResults(posts, container, query) {
            this.clearResults(container);

            if (!posts.length) {
                const p = document.createElement('p');
                p.className = 'search-no-results';
                p.textContent = 'No results found for "' + query + '"';
                container.appendChild(p);
                return;
            }

            posts.forEach(post => {
                const link = document.createElement('a');
                link.href = post.url;
                link.className = 'search-result';

                if (post.feature_image) {
                    const img = document.createElement('img');
                    img.src = post.feature_image;
                    img.alt = '';
                    img.loading = 'lazy';
                    link.appendChild(img);
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'search-result-no-image';
                    link.appendChild(placeholder);
                }

                const content = document.createElement('div');
                content.className = 'search-result-content';

                const title = document.createElement('h4');
                title.textContent = post.title;
                content.appendChild(title);

                if (post.excerpt) {
                    const excerpt = document.createElement('p');
                    const excerptText = post.excerpt.length > 120
                        ? post.excerpt.substring(0, 120) + '...'
                        : post.excerpt;
                    excerpt.textContent = excerptText;
                    content.appendChild(excerpt);
                }

                link.appendChild(content);
                container.appendChild(link);
            });
        }
    };

    // ==========================================================================
    // Sticky Header with Scroll State
    // ==========================================================================

    const StickyHeader = {
        init() {
            const header = document.querySelector('.site-header');
            if (!header) return;

            const updateHeader = () => {
                const currentScroll = window.pageYOffset;

                // Add scrolled class for frosted glass effect
                if (currentScroll > 20) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            };

            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateHeader();
                        ticking = false;
                    });
                    ticking = true;
                }
            });

            // Initial check on page load
            updateHeader();
        }
    };

    // ==========================================================================
    // Newsletter Form
    // ==========================================================================

    const NewsletterForm = {
        init() {
            const forms = document.querySelectorAll('[data-members-form]');

            forms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    const button = form.querySelector('button[type="submit"]');
                    const btnText = button.querySelector('.btn-text');
                    const btnLoading = button.querySelector('.btn-loading');

                    if (btnText && btnLoading) {
                        btnText.style.display = 'none';
                        btnLoading.style.display = 'inline';
                    }

                    button.disabled = true;
                });
            });
        }
    };

    // ==========================================================================
    // Image Lazy Loading Enhancement
    // ==========================================================================

    const LazyImages = {
        init() {
            // Add fade-in effect when images load
            const images = document.querySelectorAll('img[loading="lazy"]');

            images.forEach(img => {
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
            });
        }
    };

    // ==========================================================================
    // External Links
    // ==========================================================================

    const ExternalLinks = {
        init() {
            // Add rel="noopener noreferrer" and target="_blank" to external links
            const links = document.querySelectorAll('.post-content a, .page-content a');
            const currentHost = window.location.host;

            links.forEach(link => {
                if (link.host && link.host !== currentHost) {
                    link.setAttribute('target', '_blank');
                    link.setAttribute('rel', 'noopener noreferrer');
                }
            });
        }
    };

    // ==========================================================================
    // Footnotes Enhancement
    // ==========================================================================

    const Footnotes = {
        init() {
            // Find footnote references and add tooltip behavior
            const footnoteRefs = document.querySelectorAll('sup a[href^="#fn"]');

            footnoteRefs.forEach(ref => {
                const footnoteId = ref.getAttribute('href').substring(1);
                const footnote = document.getElementById(footnoteId);

                if (footnote) {
                    ref.setAttribute('title', footnote.textContent.trim());
                }
            });
        }
    };

    // ==========================================================================
    // Accessibility: Focus Management
    // ==========================================================================

    const Accessibility = {
        init() {
            // Add visible focus styles only for keyboard users
            document.body.addEventListener('mousedown', () => {
                document.body.classList.add('using-mouse');
            });

            document.body.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.remove('using-mouse');
                }
            });
        }
    };

    // ==========================================================================
    // Featured Posts Carousel
    // ==========================================================================

    const FeaturedCarousel = {
        init() {
            const carousel = document.querySelector('.featured-carousel');
            if (!carousel) return;

            const track = carousel.querySelector('.featured-carousel-track');
            const slides = carousel.querySelectorAll('.featured-post');
            const prevBtn = carousel.querySelector('.carousel-btn-prev');
            const nextBtn = carousel.querySelector('.carousel-btn-next');
            const dots = carousel.querySelectorAll('.carousel-dot');

            // If only one slide, no carousel needed
            if (slides.length <= 1) return;

            let currentIndex = 0;
            const totalSlides = slides.length;

            const updateCarousel = () => {
                // Move track
                track.style.transform = `translateX(-${currentIndex * 100}%)`;

                // Update dots
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                    dot.setAttribute('aria-selected', i === currentIndex);
                });

                // Update button states
                if (prevBtn) prevBtn.disabled = currentIndex === 0;
                if (nextBtn) nextBtn.disabled = currentIndex === totalSlides - 1;
            };

            const goToSlide = (index) => {
                currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
                updateCarousel();
            };

            // Button handlers
            if (prevBtn) {
                prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
            }

            // Dot handlers
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => goToSlide(i));
            });

            // Keyboard navigation
            carousel.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    goToSlide(currentIndex - 1);
                } else if (e.key === 'ArrowRight') {
                    goToSlide(currentIndex + 1);
                }
            });

            // Touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;

            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        goToSlide(currentIndex + 1); // Swipe left
                    } else {
                        goToSlide(currentIndex - 1); // Swipe right
                    }
                }
            }, { passive: true });

            // Initial state
            updateCarousel();
        }
    };

    // ==========================================================================
    // Initialize Everything
    // ==========================================================================

    document.addEventListener('DOMContentLoaded', () => {
        Navigation.init();
        Search.init();
        StickyHeader.init();
        NewsletterForm.init();
        LazyImages.init();
        ExternalLinks.init();
        Footnotes.init();
        Accessibility.init();
        FeaturedCarousel.init();
    });

})();
