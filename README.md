# Bing Wallpaper

An automated tool and archive for fetching, storing, and releasing daily Bing wallpapers from multiple markets. Powered by Go and GitHub Actions.

## [Frontend](https://zryyyy.github.io/bing-wallpaper/)

[Source Code](https://github.com/zryyyy/bing-wallpaper/tree/frontend)

![Frontend Screenshot](./assets/screenshot.png)

## Features

* **Multi-Market Support**: Fetches daily UHD wallpapers from Bing for various regions: `zh-CN`, `en-GB`, `en-US`, `en-WW`, and `ja-JP`.
* **Automated Daily Updates**: A GitHub Actions workflow runs daily to fetch new wallpapers, update the JSON data, and auto-generate markdown galleries.
* **Monthly Releases**: Automatically downloads and packages each month's wallpapers into a `.zip` archive, creating a GitHub Release on the 2nd of every month.
* **Markdown Galleries**: Generates visual `README.md` and `README-zh.md` galleries for each month, allowing easy browsing and direct downloads.

## Repository Structure

* `main.go`: The main entry point for the application.
* `fetcher/`: Handles API requests to Bing's Image Archive to retrieve wallpaper metadata.
* `storage/`: Manages reading, merging, and saving JSON metadata for the wallpapers.
* `markdown/`: Auto-generates the visually appealing markdown tables for image browsing.
* `release/`: Handles downloading the actual UHD images and packaging them into ZIP archives.
* `img/`: The storage directory containing all fetched wallpaper metadata (JSON) organized by month, along with the generated Markdown files.

## Local Usage

### Running the Project

**1. Update Daily Wallpapers**

Fetches the latest wallpapers from Bing, updates the JSON records in the `img/` directory, and regenerates the markdown files.
```bash
go run main.go -action update
```

**2. Package a Monthly Release**

Downloads the high-resolution images for a specific month and packages them into a ZIP file.

```bash
# Package a specific month
go run main.go -action release -month YYYY-MM

# Package the previous month (default behavior)
go run main.go -action release
```

## Automation (GitHub Actions)

This repository includes two built-in GitHub Actions workflows to keep the archive up to date completely hands-off:

1. **Daily Update (`daily.yml`)**: Runs automatically at 00:30 UTC every day. It executes the `update` action, commits the new JSON metadata and generated markdown files, and pushes them directly to the repository.
2. **Monthly Release (`release.yml`)**: Runs automatically at 00:00 UTC on the 2nd of every month. It executes the `release` action, packages the previous month's wallpapers into a ZIP file, and publishes a new GitHub Release containing the archive.

## Acknowledgments

This project was inspired by and references the following excellent websites and open-source projects:

* [WallpaperHub](https://www.wallpaperhub.app/)
* [Bing Wallpaper Gallery](https://bingwallpaper.anerg.com/)
* [niumoo/bing-wallpaper](https://github.com/niumoo/bing-wallpaper)
* [myseil/BingWallpaper](https://github.com/myseil/BingWallpaper)
* [npanuhin/Bing-Wallpaper-Archive](https://github.com/npanuhin/Bing-Wallpaper-Archive)
