"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// main.ts
var main_exports = {};
__export(main_exports, {
  default: () => DeadlineBarsPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");
var DEADLINE_FOLDER = "Assets/Deadline-Bars";
var EMBED_PATTERN = /\[\[(\d{1,2}-\d{1,2}-\d{2} to \d{1,2}-\d{1,2}-\d{2} deadline\.svg)\]\]/g;
var FILENAME_PATTERN = /^(\d{1,2})-(\d{1,2})-(\d{2}) to (\d{1,2})-(\d{1,2})-(\d{2}) deadline\.svg$/;
var BAR_WIDTH = 100;
var BAR_HEIGHT = 4;
var CORNER_RADIUS = 3;
var BG_COLOR = "#262626";
var UPDATE_INTERVAL_MS = 24 * 60 * 60 * 1e3;
var DeadlineBarsPlugin = class extends import_obsidian.Plugin {
  async onload() {
    console.log("Deadline Bars plugin loaded");
    await this.ensureDeadlineFolder();
    setTimeout(async () => {
      await this.updateAllBars();
    }, 5e3);
    this.registerInterval(
      window.setInterval(() => this.updateAllBars(), UPDATE_INTERVAL_MS)
    );
  }
  async ensureDeadlineFolder() {
    const folderPath = (0, import_obsidian.normalizePath)(DEADLINE_FOLDER);
    if (!await this.app.vault.adapter.exists(folderPath)) {
      await this.app.vault.createFolder(folderPath);
    }
  }
  async updateAllBars() {
    console.log("Deadline Bars: scanning notes for deadline embeds");
    const deadlineFilenames = /* @__PURE__ */ new Set();
    const markdownFiles = this.app.vault.getMarkdownFiles();
    for (const file of markdownFiles) {
      const content = await this.app.vault.read(file);
      const matches = content.matchAll(EMBED_PATTERN);
      for (const match of matches) {
        deadlineFilenames.add(match[1]);
      }
    }
    console.log(`Deadline Bars: found ${deadlineFilenames.size} deadline(s)`);
    for (const filename of deadlineFilenames) {
      await this.generateBar(filename);
    }
  }
  parseDates(filename) {
    const match = filename.match(FILENAME_PATTERN);
    if (!match) return null;
    const startMonth = parseInt(match[1]) - 1;
    const startDay = parseInt(match[2]);
    const startYear = 2e3 + parseInt(match[3]);
    const endMonth = parseInt(match[4]) - 1;
    const endDay = parseInt(match[5]);
    const endYear = 2e3 + parseInt(match[6]);
    const start = new Date(startYear, startMonth, startDay, 0, 0, 0);
    const end = new Date(endYear, endMonth, endDay, 23, 59, 59);
    return { start, end };
  }
  getColor(ratio) {
    if (ratio <= 0) return "#cccccc";
    if (ratio < 0.5) {
      const r = Math.round(255 * ratio * 2);
      return `rgb(${r}, 200, 50)`;
    } else {
      const g = Math.round(200 * (1 - ratio) * 2);
      return `rgb(255, ${g}, 50)`;
    }
  }
  generateSVG(ratio) {
    const fillWidth = Math.round(BAR_WIDTH * ratio);
    const color = this.getColor(ratio);
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${BAR_WIDTH}" height="${BAR_HEIGHT}">
  <rect width="${BAR_WIDTH}" height="${BAR_HEIGHT}" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="${BG_COLOR}"/>
  ${ratio > 0 ? `<rect width="${fillWidth}" height="${BAR_HEIGHT}" rx="${CORNER_RADIUS}" ry="${CORNER_RADIUS}" fill="${color}"/>` : ""}
</svg>`;
  }
  async generateBar(filename) {
    const dates = this.parseDates(filename);
    if (!dates) return;
    const { start, end } = dates;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    let ratio;
    if (today <= start) {
      ratio = 0;
    } else if (today >= end) {
      ratio = 1;
    } else {
      const totalDays = end.getTime() - start.getTime();
      const elapsedDays = today.getTime() - start.getTime();
      ratio = elapsedDays / totalDays;
    }
    const svg = this.generateSVG(ratio);
    const filePath = (0, import_obsidian.normalizePath)(`${DEADLINE_FOLDER}/${filename}`);
    await this.app.vault.adapter.write(filePath, svg);
    console.log(`Deadline Bars: generated ${filename} with ratio ${ratio.toFixed(2)}`);
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibWFpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgUGx1Z2luLCBub3JtYWxpemVQYXRoIH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcblxyXG5jb25zdCBERUFETElORV9GT0xERVIgPSBcIkFzc2V0cy9EZWFkbGluZS1CYXJzXCI7XHJcbmNvbnN0IEVNQkVEX1BBVFRFUk4gPSAvXFxbXFxbKFxcZHsxLDJ9LVxcZHsxLDJ9LVxcZHsyfSB0byBcXGR7MSwyfS1cXGR7MSwyfS1cXGR7Mn0gZGVhZGxpbmVcXC5zdmcpXFxdXFxdL2c7XHJcbmNvbnN0IEZJTEVOQU1FX1BBVFRFUk4gPSAvXihcXGR7MSwyfSktKFxcZHsxLDJ9KS0oXFxkezJ9KSB0byAoXFxkezEsMn0pLShcXGR7MSwyfSktKFxcZHsyfSkgZGVhZGxpbmVcXC5zdmckLztcclxuY29uc3QgQkFSX1dJRFRIID0gMTAwO1xyXG5jb25zdCBCQVJfSEVJR0hUID0gNDtcclxuY29uc3QgQ09STkVSX1JBRElVUyA9IDM7XHJcbmNvbnN0IEJHX0NPTE9SID0gXCIjMjYyNjI2XCI7XHJcbmNvbnN0IFVQREFURV9JTlRFUlZBTF9NUyA9IDI0ICogNjAgKiA2MCAqIDEwMDA7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEZWFkbGluZUJhcnNQbHVnaW4gZXh0ZW5kcyBQbHVnaW4ge1xyXG4gIGFzeW5jIG9ubG9hZCgpIHtcclxuICAgIGNvbnNvbGUubG9nKFwiRGVhZGxpbmUgQmFycyBwbHVnaW4gbG9hZGVkXCIpO1xyXG4gICAgYXdhaXQgdGhpcy5lbnN1cmVEZWFkbGluZUZvbGRlcigpO1xyXG4gICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XHJcbiAgICAgIGF3YWl0IHRoaXMudXBkYXRlQWxsQmFycygpO1xyXG4gICAgfSwgNTAwMCk7XHJcbiAgICB0aGlzLnJlZ2lzdGVySW50ZXJ2YWwoXHJcbiAgICAgIHdpbmRvdy5zZXRJbnRlcnZhbCgoKSA9PiB0aGlzLnVwZGF0ZUFsbEJhcnMoKSwgVVBEQVRFX0lOVEVSVkFMX01TKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGFzeW5jIGVuc3VyZURlYWRsaW5lRm9sZGVyKCkge1xyXG4gICAgY29uc3QgZm9sZGVyUGF0aCA9IG5vcm1hbGl6ZVBhdGgoREVBRExJTkVfRk9MREVSKTtcclxuICAgIGlmICghKGF3YWl0IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZXhpc3RzKGZvbGRlclBhdGgpKSkge1xyXG4gICAgICBhd2FpdCB0aGlzLmFwcC52YXVsdC5jcmVhdGVGb2xkZXIoZm9sZGVyUGF0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBhc3luYyB1cGRhdGVBbGxCYXJzKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJEZWFkbGluZSBCYXJzOiBzY2FubmluZyBub3RlcyBmb3IgZGVhZGxpbmUgZW1iZWRzXCIpO1xyXG4gICAgY29uc3QgZGVhZGxpbmVGaWxlbmFtZXMgPSBuZXcgU2V0PHN0cmluZz4oKTtcclxuICAgIGNvbnN0IG1hcmtkb3duRmlsZXMgPSB0aGlzLmFwcC52YXVsdC5nZXRNYXJrZG93bkZpbGVzKCk7XHJcbiAgICBmb3IgKGNvbnN0IGZpbGUgb2YgbWFya2Rvd25GaWxlcykge1xyXG4gICAgICBjb25zdCBjb250ZW50ID0gYXdhaXQgdGhpcy5hcHAudmF1bHQucmVhZChmaWxlKTtcclxuICAgICAgY29uc3QgbWF0Y2hlcyA9IGNvbnRlbnQubWF0Y2hBbGwoRU1CRURfUEFUVEVSTik7XHJcbiAgICAgIGZvciAoY29uc3QgbWF0Y2ggb2YgbWF0Y2hlcykge1xyXG4gICAgICAgIGRlYWRsaW5lRmlsZW5hbWVzLmFkZChtYXRjaFsxXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKGBEZWFkbGluZSBCYXJzOiBmb3VuZCAke2RlYWRsaW5lRmlsZW5hbWVzLnNpemV9IGRlYWRsaW5lKHMpYCk7XHJcbiAgICBmb3IgKGNvbnN0IGZpbGVuYW1lIG9mIGRlYWRsaW5lRmlsZW5hbWVzKSB7XHJcbiAgICAgIGF3YWl0IHRoaXMuZ2VuZXJhdGVCYXIoZmlsZW5hbWUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcGFyc2VEYXRlcyhmaWxlbmFtZTogc3RyaW5nKTogeyBzdGFydDogRGF0ZTsgZW5kOiBEYXRlIH0gfCBudWxsIHtcclxuICAgIGNvbnN0IG1hdGNoID0gZmlsZW5hbWUubWF0Y2goRklMRU5BTUVfUEFUVEVSTik7XHJcbiAgICBpZiAoIW1hdGNoKSByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHN0YXJ0TW9udGggPSBwYXJzZUludChtYXRjaFsxXSkgLSAxO1xyXG4gICAgY29uc3Qgc3RhcnREYXkgPSBwYXJzZUludChtYXRjaFsyXSk7XHJcbiAgICBjb25zdCBzdGFydFllYXIgPSAyMDAwICsgcGFyc2VJbnQobWF0Y2hbM10pO1xyXG4gICAgY29uc3QgZW5kTW9udGggPSBwYXJzZUludChtYXRjaFs0XSkgLSAxO1xyXG4gICAgY29uc3QgZW5kRGF5ID0gcGFyc2VJbnQobWF0Y2hbNV0pO1xyXG4gICAgY29uc3QgZW5kWWVhciA9IDIwMDAgKyBwYXJzZUludChtYXRjaFs2XSk7XHJcbiAgICBjb25zdCBzdGFydCA9IG5ldyBEYXRlKHN0YXJ0WWVhciwgc3RhcnRNb250aCwgc3RhcnREYXksIDAsIDAsIDApO1xyXG4gICAgY29uc3QgZW5kID0gbmV3IERhdGUoZW5kWWVhciwgZW5kTW9udGgsIGVuZERheSwgMjMsIDU5LCA1OSk7XHJcbiAgICByZXR1cm4geyBzdGFydCwgZW5kIH07XHJcbiAgfVxyXG5cclxuICBnZXRDb2xvcihyYXRpbzogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIGlmIChyYXRpbyA8PSAwKSByZXR1cm4gXCIjY2NjY2NjXCI7XHJcbiAgICBpZiAocmF0aW8gPCAwLjUpIHtcclxuICAgICAgY29uc3QgciA9IE1hdGgucm91bmQoMjU1ICogcmF0aW8gKiAyKTtcclxuICAgICAgcmV0dXJuIGByZ2IoJHtyfSwgMjAwLCA1MClgO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgZyA9IE1hdGgucm91bmQoMjAwICogKDEgLSByYXRpbykgKiAyKTtcclxuICAgICAgcmV0dXJuIGByZ2IoMjU1LCAke2d9LCA1MClgO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2VuZXJhdGVTVkcocmF0aW86IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICBjb25zdCBmaWxsV2lkdGggPSBNYXRoLnJvdW5kKEJBUl9XSURUSCAqIHJhdGlvKTtcclxuICAgIGNvbnN0IGNvbG9yID0gdGhpcy5nZXRDb2xvcihyYXRpbyk7XHJcbiAgICByZXR1cm4gYDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHdpZHRoPVwiJHtCQVJfV0lEVEh9XCIgaGVpZ2h0PVwiJHtCQVJfSEVJR0hUfVwiPlxyXG4gIDxyZWN0IHdpZHRoPVwiJHtCQVJfV0lEVEh9XCIgaGVpZ2h0PVwiJHtCQVJfSEVJR0hUfVwiIHJ4PVwiJHtDT1JORVJfUkFESVVTfVwiIHJ5PVwiJHtDT1JORVJfUkFESVVTfVwiIGZpbGw9XCIke0JHX0NPTE9SfVwiLz5cclxuICAke3JhdGlvID4gMCA/IGA8cmVjdCB3aWR0aD1cIiR7ZmlsbFdpZHRofVwiIGhlaWdodD1cIiR7QkFSX0hFSUdIVH1cIiByeD1cIiR7Q09STkVSX1JBRElVU31cIiByeT1cIiR7Q09STkVSX1JBRElVU31cIiBmaWxsPVwiJHtjb2xvcn1cIi8+YCA6IFwiXCJ9XHJcbjwvc3ZnPmA7XHJcbiAgfVxyXG5cclxuICBhc3luYyBnZW5lcmF0ZUJhcihmaWxlbmFtZTogc3RyaW5nKSB7XHJcbiAgICBjb25zdCBkYXRlcyA9IHRoaXMucGFyc2VEYXRlcyhmaWxlbmFtZSk7XHJcbiAgICBpZiAoIWRhdGVzKSByZXR1cm47XHJcbiAgICBjb25zdCB7IHN0YXJ0LCBlbmQgfSA9IGRhdGVzO1xyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcblxyXG4gICAgbGV0IHJhdGlvOiBudW1iZXI7XHJcbiAgICBpZiAodG9kYXkgPD0gc3RhcnQpIHtcclxuICAgICAgcmF0aW8gPSAwO1xyXG4gICAgfSBlbHNlIGlmICh0b2RheSA+PSBlbmQpIHtcclxuICAgICAgcmF0aW8gPSAxO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgdG90YWxEYXlzID0gZW5kLmdldFRpbWUoKSAtIHN0YXJ0LmdldFRpbWUoKTtcclxuICAgICAgY29uc3QgZWxhcHNlZERheXMgPSB0b2RheS5nZXRUaW1lKCkgLSBzdGFydC5nZXRUaW1lKCk7XHJcbiAgICAgIHJhdGlvID0gZWxhcHNlZERheXMgLyB0b3RhbERheXM7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3ZnID0gdGhpcy5nZW5lcmF0ZVNWRyhyYXRpbyk7XHJcbiAgICBjb25zdCBmaWxlUGF0aCA9IG5vcm1hbGl6ZVBhdGgoYCR7REVBRExJTkVfRk9MREVSfS8ke2ZpbGVuYW1lfWApO1xyXG4gICAgYXdhaXQgdGhpcy5hcHAudmF1bHQuYWRhcHRlci53cml0ZShmaWxlUGF0aCwgc3ZnKTtcclxuICAgIGNvbnNvbGUubG9nKGBEZWFkbGluZSBCYXJzOiBnZW5lcmF0ZWQgJHtmaWxlbmFtZX0gd2l0aCByYXRpbyAke3JhdGlvLnRvRml4ZWQoMil9YCk7XHJcbiAgfVxyXG59Il0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsc0JBQXNDO0FBRXRDLElBQU0sa0JBQWtCO0FBQ3hCLElBQU0sZ0JBQWdCO0FBQ3RCLElBQU0sbUJBQW1CO0FBQ3pCLElBQU0sWUFBWTtBQUNsQixJQUFNLGFBQWE7QUFDbkIsSUFBTSxnQkFBZ0I7QUFDdEIsSUFBTSxXQUFXO0FBQ2pCLElBQU0scUJBQXFCLEtBQUssS0FBSyxLQUFLO0FBRTFDLElBQXFCLHFCQUFyQixjQUFnRCx1QkFBTztBQUFBLEVBQ3JELE1BQU0sU0FBUztBQUNiLFlBQVEsSUFBSSw2QkFBNkI7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
