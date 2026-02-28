package storage

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"bing-wallpaper/fetcher"
)

func ReadJSON(path string) ([]fetcher.Wallpaper, error) {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return []fetcher.Wallpaper{}, nil
	}

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var wps []fetcher.Wallpaper
	if err := json.Unmarshal(data, &wps); err != nil {
		if len(strings.TrimSpace(string(data))) == 0 {
			return []fetcher.Wallpaper{}, nil
		}
		return nil, err
	}

	return wps, nil
}

func WriteJSON(path string, wps []fetcher.Wallpaper) error {
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	data, err := json.MarshalIndent(wps, "", "  ")
	if err != nil {
		return err
	}

	// Add trailing newline corresponding to standard format
	data = append(data, '\n')

	return os.WriteFile(path, data, 0644)
}

func parseMonth(dateStr string) string {
	if len(dateStr) >= 6 {
		return fmt.Sprintf("%s-%s", dateStr[0:4], dateStr[4:6])
	}
	return "unknown"
}

func UpdateWallpapers(market string, newWps []fetcher.Wallpaper, baseDir string) error {
	recentPath := filepath.Join(baseDir, fmt.Sprintf("%s.json", market))
	recent, _ := ReadJSON(recentPath)

	wpMap := make(map[string]fetcher.Wallpaper)
	for _, wp := range recent {
		wpMap[wp.Date] = wp
	}
	for _, wp := range newWps {
		wpMap[wp.Date] = wp
	}

	var allRecent []fetcher.Wallpaper
	for _, wp := range wpMap {
		allRecent = append(allRecent, wp)
	}

	sort.Slice(allRecent, func(i, j int) bool {
		return allRecent[i].Date > allRecent[j].Date
	})

	if len(allRecent) > 30 {
		allRecent = allRecent[:30]
	}

	sort.Slice(allRecent, func(i, j int) bool {
		return allRecent[i].Date < allRecent[j].Date
	})

	if err := WriteJSON(recentPath, allRecent); err != nil {
		return fmt.Errorf("failed writing %s: %w", recentPath, err)
	}

	monthGrouped := make(map[string][]fetcher.Wallpaper)
	for _, wp := range newWps {
		month := parseMonth(wp.Date)
		monthGrouped[month] = append(monthGrouped[month], wp)
	}

	for month, mNewWps := range monthGrouped {
		monthPath := filepath.Join(baseDir, month, fmt.Sprintf("%s.json", market))
		mRecent, _ := ReadJSON(monthPath)

		mMap := make(map[string]fetcher.Wallpaper)
		for _, wp := range mRecent {
			mMap[wp.Date] = wp
		}
		for _, wp := range mNewWps {
			mMap[wp.Date] = wp
		}

		var merged []fetcher.Wallpaper
		for _, wp := range mMap {
			merged = append(merged, wp)
		}

		sort.Slice(merged, func(i, j int) bool {
			return merged[i].Date < merged[j].Date
		})

		if err := WriteJSON(monthPath, merged); err != nil {
			return fmt.Errorf("failed writing %s: %w", monthPath, err)
		}
	}

	return nil
}
