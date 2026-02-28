package main

import (
	"flag"
	"fmt"
	"log"
	"time"

	"bing-wallpaper/fetcher"
	"bing-wallpaper/markdown"
	"bing-wallpaper/release"
	"bing-wallpaper/storage"
)

func main() {
	action := flag.String("action", "update", "Action to perform: update or release")
	month := flag.String("month", "", "Month to release (e.g. YYYY-MM), defaults to last month")
	flag.Parse()

	markets := []string{"zh-CN", "en-GB", "en-US", "en-WW", "ja-JP"}
	baseDir := "img"

	if *action == "update" {
		for _, mkt := range markets {
			wps, err := fetcher.FetchWallpapers(mkt)
			if err != nil {
				log.Printf("Failed to fetch %s: %v\n", mkt, err)
				continue
			}

			if err := storage.UpdateWallpapers(mkt, wps, baseDir); err != nil {
				log.Printf("Failed to update storage for %s: %v\n", mkt, err)
			}
		}

		currentMonth := time.Now().Format("2006-01")
		if err := markdown.GenerateMarkdown(baseDir, currentMonth); err != nil {
			log.Printf("Failed to generate markdown for current month: %v\n", err)
		}

		lastMonth := time.Now().AddDate(0, -1, 0).Format("2006-01")
		if err := markdown.GenerateMarkdown(baseDir, lastMonth); err != nil {
			log.Printf("Failed to generate markdown for last month: %v\n", err)
		}

		fmt.Println("Update completed successfully.")
	} else if *action == "release" {
		targetMonth := *month
		if targetMonth == "" {
			now := time.Now()
			lastMonth := now.AddDate(0, -1, 0)
			targetMonth = lastMonth.Format("2006-01")
		}

		zipName := fmt.Sprintf("%s.zip", targetMonth)
		if err := release.PackageMonth(targetMonth, zipName, baseDir); err != nil {
			log.Fatalf("Failed to package release: %v", err)
		}
		fmt.Printf("Packaged %s successfully.\n", zipName)
	} else {
		log.Fatalf("Unknown action: %s", *action)
	}
}
