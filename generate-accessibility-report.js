import * as fs from 'fs/promises'
import * as path from 'path'
import * as cheerio from 'cheerio'
import assert from 'assert'

let criticalIssues = 0
let mediumIssues = 0

/*
Generate the HTML content for the merged accessibility report
 */
function getMergedTopHtml(total, critical, medium) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Accessibility Test Run Report</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <style>
    .stats-chart-row { display: block; height: 25px }
    .stats-chart-row-label { font-size: 12px; width: 50%; float: left }
    .stats-chart-row-value { font-size: 12px; float: right; margin-left: 5px }
    .stats-chart-row-value.color-high { color: #f66 }
    .stats-chart-row-value.color-medium { color: #eeb943 }
    .stats-chart-row-value.color-low { color: #60c888 }
    .stats-chart-row-items { font-size: 12px; float: right }
    .stats-chart-row-bar { position: relative; float: left; height: 5px; background-color: #4c608d; width: 100%; margin-bottom: 10px }
    .stats-chart-row-bar-value { position: absolute; top: 0; left: 0; height: 5px }
    .stats-chart-row-bar-value.color-high { background-color: #f66 }
    .stats-chart-row-bar-value.color-medium { background-color: #eeb943 }
    .stats-chart-row-bar-value.color-low { background-color: #60c888 }
    .block-color { background-color: #334670; }
    .complaint-text { font-size: 12px; }
    .light-red { background-color: #FFCCCB; }
  </style>
</head>
<body>
<h1 class="mt-4 mb-3 text-center">Accessibility Test Run Report</h1>
<div class="container mt-4 bg-light shadow-lg">
  <div class="container-fluid p-3">
    <div class="text-secondary mb-4">Test Run: ${new Date().toISOString()}</div>
    <div class="row mb-3">
      <div class="col-4">
        <div class="card">
          <div class="card-header h6 block-color text-white text-opacity-75">
            Total Pages
          </div>
          <div class="card-body text-center h6" id="total">
            ${total}
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card">
          <div class="card-header h6 bg-danger bg-gradient text-white text-opacity-75">
            Critical Issues
          </div>
          <div class="card-body text-center h6" id="critical">
            ${critical}
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="card">
          <div class="card-header h6 bg-warning bg-gradient text-white text-opacity-75">
            Medium Issues
          </div>
          <div class="card-body text-center h6" id="medium">
            ${medium}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`
}

/*
Merge all given HTML files into a single report
 */
async function mergeHtmlFilesIntoSingleReport(filePaths, outputFilePath) {
  let mergedHtml = ''
  for (const filePath of filePaths) {
    try {
      const htmlContent = await fs.readFile(filePath, 'utf-8')
      const $ = cheerio.load(htmlContent)

      // Remove the <h1> element with the specified class and text
      $('h1.mt-4.mb-3').each((index, element) => {
        if ($(element).text().trim() === 'Accessibility Test Run Report') {
          $(element).remove() // Remove the element
        }
      })

      // Remove the <div> with class "container mt-4 bg-light shadow-lg"
      const firstContainerDiv = $(
        'div.container.mt-4.bg-light.shadow-lg'
      ).first()
      if (firstContainerDiv.length > 0) {
        firstContainerDiv.remove()
      } else {
        console.warn('No matching container div found to remove.')
      }

      // Find all <h6> elements with class "text-secondary" & remove Page n
      $('h6.text-secondary').each((index, element) => {
        const text = $(element).text().trim()

        if (text.startsWith('Page')) {
          const newText = text
            .replace(/^Page\s+\d+\s*-\s*"/, '')
            .replace(/"$/, '')
            .trim()
          $(element).text(newText) // Update the element's text
        }
      })

      // Read body contents
      const bodyContent = $('body').html() || ''
      if (bodyContent != null) {
        mergedHtml += bodyContent
      } else {
        console.error(`Could not find <body> tags in ${filePath}`)
      }
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error)
    }
  }

  mergedHtml += '</body></html>'
  mergedHtml = getMergedTopHtml(0, criticalIssues, mediumIssues) + mergedHtml
  const $ = cheerio.load(mergedHtml)
  const uniqueContent = new Set()

  $('h6.text-secondary').each((index, element) => {
    const text = $(element).text().trim()

    // Check if the content is a duplicate
    if (uniqueContent.has(text)) {
      $(element).parent('.container .mt-4 .bg-light .shadow-lg').remove() // Remove the duplicate element
    } else {
      uniqueContent.add(text) // Add the content to the set of unique content

      // Extract critical issues
      criticalIssues += parseInt(
        $(element)
          .closest('.container-fluid')
          .find('.stats-chart-row-label:contains("Critical")')
          .closest('.stats-chart-row')
          .find('.stat-item')
          .text()
          .trim(),
        10
      )

      // Extract medium issues
      mediumIssues += parseInt(
        $(element)
          .closest('.container-fluid')
          .find('.stats-chart-row-label:contains("Medium")')
          .closest('.stats-chart-row')
          .find('.stat-item')
          .text()
          .trim(),
        10
      )
    }
  })

  // Replace with actual values
  $('#total').text(String(uniqueContent.size))
  $('#critical').text(String(criticalIssues))
  $('#medium').text(String(mediumIssues))

  try {
    await fs.writeFile(outputFilePath, $.html(), 'utf-8')
    console.log(`Merged HTML report saved to ${outputFilePath}`)
  } catch (error) {
    console.error(`Error writing to ${outputFilePath}:`, error)
  }
}

/*
Generate a list of files matching the pattern
 */
async function getMatchingFiles(directoryPath) {
  const pattern = 'report-*.html'
  try {
    const files = await fs.readdir(directoryPath)
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$')

    return files
      .filter((file) => regex.test(file))
      .map((file) => path.join(directoryPath, file))
  } catch (error) {
    console.error(`Error reading directory ${directoryPath}:`, error)
    return []
  }
}

/*
main/entry method
 */
async function main() {
  const filePaths = await getMatchingFiles('./reports/accessibility')

  if (filePaths.length === 0) {
    console.error('Please provide at least one HTML file path.')
    return
  }

  const outputFilePath = './reports/accessibility-report.html'
  const goutputFilePath = './reports/gaccessibility-report.html'

  await mergeHtmlFilesIntoSingleReport(filePaths, outputFilePath)
  await mergeHtmlFilesIntoSingleReport(filePaths, goutputFilePath)
  assert(criticalIssues === 0, `Found ${criticalIssues} critical issues.`)
  assert(mediumIssues === 0, `Found ${mediumIssues} medium issues.`)
}

await main()
