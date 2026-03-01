package release

import (
	"archive/zip"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"bing-wallpaper/fetcher"
	"bing-wallpaper/storage"
)

func PackageMonth(month string, outputZip string, baseDir string) error {
	markets := []string{"zh-CN", "en-GB", "en-US", "ja-JP", "en-SG"}

	zipFile, err := os.Create(outputZip)
	if err != nil {
		return err
	}
	defer zipFile.Close()

	archive := zip.NewWriter(zipFile)
	defer archive.Close()

	for _, mkt := range markets {
		jsonPath := filepath.Join(baseDir, month, fmt.Sprintf("%s.json", mkt))
		wps, err := storage.ReadJSON(jsonPath)
		if err != nil || len(wps) == 0 {
			continue
		}

		for _, wp := range wps {
			err := addImageToZip(archive, wp, mkt)
			if err != nil {
				fmt.Printf("Failed to download %s for %s: %v\n", wp.URL, mkt, err)
			}
		}
	}

	return nil
}

func addImageToZip(archive *zip.Writer, wp fetcher.Wallpaper, market string) error {
	resp, err := http.Get(wp.URL)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	filename := fmt.Sprintf("%s/%s.jpg", market, wp.Date)
	writer, err := archive.Create(filename)
	if err != nil {
		return err
	}

	_, err = io.Copy(writer, resp.Body)
	return err
}
