# RetroSound — TheAudioDB Assignment Version

## Files

- `index.html` — semantic HTML structure and HTML form
- `style.css` — original mobile-first responsive CSS
- `script.js` — navigation, form validation, API calls and dynamic results

## How the app meets the assignment guidance

### HTML Quality
The page uses semantic elements including `header`, `nav`, `main`, `section`, `article`, `aside` and `footer`. It also contains a page title, navigation links, lists, headings, labels and accessible form controls.

### CSS Quality
CSS is stored in the external `style.css` file. The layout starts with mobile rules and progressively expands through `@media (min-width: ...)` rules. The stylesheet demonstrates:
- HTML/element selectors
- class selectors
- ID selectors
- attribute selector: `input[required]`
- pseudo-classes such as `:hover`, `:focus`, `:focus-visible`, `:invalid`
- responsive design
- reduced-motion accessibility support

### JavaScript Quality
JavaScript provides:
- animated mobile navigation
- form validation
- loading feedback
- error handling
- dynamic API result cards
- clear-results interaction
- accessible status updates using `aria-live`

### HTML Forms
The search form uses:
- text input
- `required`
- `minlength`
- `maxlength`
- `autocomplete`
- select menus
- submit button

The values entered/selected by the user are used to construct API requests.

### API
The app uses TheAudioDB V1 API. The artist name entered into the form is sent to the API, then additional API calls request the artist discography and album/track details.

TheAudioDB currently provides a free V1 API key in its public documentation. Some search methods are restricted on the free tier, so this project deliberately uses the free artist/discography/lookup workflow rather than relying on premium-only track searching.

### User Interface, UX and Accessibility
The project includes:
- responsive mobile-first layout
- visible focus states
- skip-to-content link
- semantic landmarks
- labels for all form fields
- `aria-live` status/result regions
- `aria-busy` while results are loading
- keyboard-friendly navigation
- `prefers-reduced-motion` support
- meaningful image alternative text

## Important note about Composer

TheAudioDB track records do not consistently expose a composer field. The JavaScript therefore reads a composer field if the API provides one and otherwise displays `Not listed`. The application does not invent composer credits.

## GitHub Pages

1. Create a GitHub repository, for example `RetroSound`.
2. Upload `index.html`, `style.css`, `script.js` and this README.
3. Open repository Settings → Pages.
4. Select the `main` branch and `/root` folder.
5. Save and wait for GitHub Pages to publish the site.

## Suggested test searches

Try:
- Queen
- Coldplay
- The Beatles
- Pink Floyd
- Michael Jackson

## API documentation

TheAudioDB API documentation:
https://www.theaudiodb.com/free_music_api
