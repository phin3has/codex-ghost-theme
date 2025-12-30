# Codex

A scholarly Ghost theme with warm paper aesthetics, classic typography, and thoughtful design for long-form content.

![Ghost](https://img.shields.io/badge/Ghost-%3E%3D5.0.0-738a94?style=flat-square&logo=ghost)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## Features

- **Typography-First Design**: Beautiful serif fonts (Playfair Display + Source Serif 4) optimized for long-form reading
- **Warm Color Palette**: Parchment-inspired backgrounds with ink text and bronze accents
- **Featured Post Carousel**: Elegant carousel for highlighted content
- **Inspirational Quotes**: Homepage quote section with customizable attribution
- **Ghost Membership**: Full integration with Ghost's membership and newsletter features
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Search**: Built-in search functionality (requires Content API key)
- **SEO Optimized**: Clean semantic HTML with proper meta tags

## Installation

### Quick Install (Recommended)

1. Download `codex-ghost-theme.zip` from the [latest release](https://github.com/phin3has/codex-ghost-theme/releases/latest)
2. Go to Ghost Admin → Settings → Design → Change Theme
3. Upload the zip file
4. Activate the theme

### Build from Source

```bash
# Clone the repo
git clone https://github.com/phin3has/codex-ghost-theme.git
cd codex-ghost-theme

# Install dependencies and create zip
npm install
npm run zip

# Upload the generated zip to Ghost Admin
```

### Custom Routing (Optional)

To enable custom content collections:

1. Copy `routes.yaml` to `content/settings/routes.yaml` in your Ghost installation
2. Restart Ghost

## Configuration

### Theme Settings

Go to **Ghost Admin → Settings → Design → Site Design** to customize:

| Setting | Options | Description |
|---------|---------|-------------|
| Navigation Layout | Left / Center | Logo position in header |
| Title Font | Playfair Display, EB Garamond, Cormorant Garamond, Spectral | Heading font |
| Body Font | Source Serif 4, Literata, Lora | Body text font |
| Accent Color | Color picker | Primary accent (default: bronze #9D8461) |
| Reading Time | On/Off | Show reading time estimates |
| Homepage Quote | Text | Inspirational quote on homepage |
| Quote Author | Text | Quote attribution |
| Quote Source | Text | Quote source (book, etc.) |
| Content API Key | Text | For search functionality |

### Enabling Search

1. Go to Ghost Admin → Settings → Integrations
2. Create a new Custom Integration
3. Copy the Content API Key
4. Paste it in Theme Settings → Content API Key

### Custom Templates

- **About Page**: Create a page → Page Settings → Template → Select "About"

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
# Install dependencies
npm install

# Run theme validation
npm test

# Create production zip
npm run zip
```

### File Structure

```
codex-ghost-theme/
├── assets/
│   ├── css/
│   │   └── screen.css      # Main stylesheet
│   ├── js/
│   │   └── main.js         # Theme JavaScript
│   └── images/             # Theme images
├── partials/
│   ├── header.hbs          # Site header
│   ├── footer.hbs          # Site footer
│   └── post-card.hbs       # Post card component
├── members/
│   ├── signin.hbs          # Sign in page
│   ├── signup.hbs          # Sign up page
│   └── account.hbs         # Account page
├── default.hbs             # Base template
├── index.hbs               # Homepage
├── post.hbs                # Single post
├── page.hbs                # Static pages
├── tag.hbs                 # Tag archive
├── author.hbs              # Author archive
├── error.hbs               # Error pages
├── custom-about.hbs        # Custom About template
├── package.json            # Theme manifest
├── routes.yaml             # Custom routing
└── README.md
```

## Design Philosophy

> "A timeless scholarly library meets modern publishing."

### Visual Direction

- **Typography**: Classic serifs that feel scholarly yet welcoming
- **Colors**: Warm neutrals with parchment undertones
- **Layout**: Generous margins for comfortable reading
- **Texture**: Subtle paper texture overlay for depth
- **Accents**: Bronze highlights for warmth

## Credits

- Built for [Ghost](https://ghost.org)
- Fonts from [Google Fonts](https://fonts.google.com)
- Icons from [Feather Icons](https://feathericons.com)

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with care for those who value beautiful, readable content.
