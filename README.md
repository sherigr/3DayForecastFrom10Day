# 3DayForecastFrom10Day

Assignment: 

Create an HTML file that is reactive to the query string at the end of the URL. The query strings are 'zip_code' and 'date'.
For example, if the file is index.html, it should be reactive to: <br /> index.html?zip_code=10011&date=04/10/2016

- Use API data to create a page
- The 'zip_code' param should be use as part of the API request
- The 'date' param should be use to extract the corresponding forecasts from the API response (assume the merged in "date" will be within the next ten days)
- If search date is current day, first day should show "Today" instead of day of week
- Use Helvetica for all fonts instead of what is in the image 
- Use icons from provided link
- If the page must error out, it should appear as a blank page (completely blank)

- Outline any gotchas that the end user may experience. 
  * Gotchas:
    * Must use 4-digit year (yyyy); 2 digit year (yy) will break code
    * Need to use _ in zip_code, anything else will cause it to break
    
