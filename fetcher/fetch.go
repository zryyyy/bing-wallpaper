package fetcher

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

type BingResponse struct {
	Images []struct {
		StartDate string `json:"startdate"`
		URLBase   string `json:"urlbase"`
		Copyright string `json:"copyright"`
	} `json:"images"`
}

type Wallpaper struct {
	Date      string `json:"date"`
	URL       string `json:"url"`
	Copyright string `json:"copyright"`
}

func FetchWallpapers(market string) ([]Wallpaper, error) {
	url := fmt.Sprintf("https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=%s", market)
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch data: %s", resp.Status)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var bingResp BingResponse
	if err := json.Unmarshal(body, &bingResp); err != nil {
		return nil, err
	}

	var wallpapers []Wallpaper
	for _, img := range bingResp.Images {
		wallpapers = append(wallpapers, Wallpaper{
			Date:      img.StartDate,
			URL:       fmt.Sprintf("https://www.bing.com%s_UHD.jpg", img.URLBase),
			Copyright: img.Copyright,
		})
	}

	return wallpapers, nil
}
