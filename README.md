# cf-dump
Cloudflare analytics export to CSV

cf-dump is a tool to export all analytics from your Cloudflare account to a usefull CSV file.

You can then import that file where you prefer, in a spreadsheet, in a database, or where you like.


**DEPENDENCIES:**
You need to have NodeJS installed on your machine.

Usage:
```sh
$ ./cf-dump.js <email> <api key>
```

Example:
```sh
$ ./cf-dump.js email@example.com 2d020di24n2j2kd9di2j2eh82ndwdfdssi2ei
```

Please note that it does not write output to any, but it writes the CSV to the standard output. You can pipe it (and filter, sort, etc) or just save it to a file.
```sh
$ ./cf-dump.js email@example.com 2d020di24n2j2kd9di2j2eh82ndwdfdssi2ei > result.csv
```

Please also note that it prints download state and errors on standard output. You may need to redirect stdout to /dev/null.

In order to get your API key
- login to your Cloudflare account
- in the top right corner, click on your email address
- click on "My settings"
- scroll and find "API Key" section
- Click on "View API Key" on the "Global API Key" row
