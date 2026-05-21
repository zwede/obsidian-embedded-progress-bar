# obsidian-embedded-progress-bar

An obsidian plugin that automatically generates progress bars in the form of svg files that automatically update.

## How to Use

Type in `[[M-D-Y to M-D-Y deadline.svg]]` into any note anywhere.
The plugin will automatically scan the entire vault for the above syntax and generates and saves an svg file in your vault.

<img width="400" height="200" alt="Timeline 1" src="https://github.com/user-attachments/assets/6abfdcd0-8b73-4a3c-89e1-337970ab2b34" />

The plugin will generate the progress bar to be filled in according to todays date relative to the first and second dates in the svg filename.
The plugin will update the progress bars once a day.

## Installation

### Manual Installation

1. Download `main.js` and `manifest.json` files into `<vault>/.obsidian/plugins/countdown-to/`
2. Reload Obsidian
3. Enable the plugin in Obsidian settings under Community Plugins


