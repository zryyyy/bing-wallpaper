package markdown

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"bing-wallpaper/fetcher"
	"bing-wallpaper/storage"
)

func GenerateMarkdown(baseDir string, month string) error {
	configs := []struct {
		Market   string
		Filename string
		Title    string
	}{
		{"en-WW", "README.md", month},
		{"zh-CN", "README-zh.md", month},
	}

	for _, cfg := range configs {
		jsonPath := filepath.Join(baseDir, month, fmt.Sprintf("%s.json", cfg.Market))
		wps, err := storage.ReadJSON(jsonPath)
		if err != nil {
			continue
		}
		if len(wps) == 0 {
			continue
		}

		mdPath := filepath.Join(baseDir, month, cfg.Filename)
		err = writeMarkdown(mdPath, cfg.Title, wps)
		if err != nil {
			return err
		}
	}
	return nil
}

func writeMarkdown(path string, title string, wps []fetcher.Wallpaper) error {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("## %s\n\n", title))
	sb.WriteString("<table>\n")

	for i := 0; i < len(wps); i += 3 {
		sb.WriteString("  <tr>\n")
		for j := 0; j < 3; j++ {
			if i+j < len(wps) {
				wp := wps[i+j]
				dateStr := wp.Date[0:4] + "-" + wp.Date[4:6] + "-" + wp.Date[6:8]

				altText := strings.ReplaceAll(wp.Copyright, `"`, `&quot;`)

				sb.WriteString("    <td align=\"center\">\n")
				sb.WriteString(fmt.Sprintf("      <img src=\"%s\" alt=\"%s\" /><br>\n", wp.URL, altText))
				sb.WriteString(fmt.Sprintf("      %s <a href=\"%s\">Download</a>\n", dateStr, wp.URL))
				sb.WriteString("    </td>\n")
			} else {
				sb.WriteString("    <td></td>\n")
			}
		}
		sb.WriteString("  </tr>\n")
	}
	sb.WriteString("</table>\n")

	return os.WriteFile(path, []byte(sb.String()), 0644)
}
