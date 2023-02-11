const fs = require('fs/promises')
const path = require('path')
const vendorsJson = require('./vendors.json')

// Sort the vendors by name
const sortedVendors = vendorsJson.map(item => item).sort((a, b) => a.name.localeCompare(b.name))

// Get the full path to the vendors file
const vendorsFilePath = path.join(__dirname, 'vendors.json')

const sort = async () => {
  try {
    const vendorsString = JSON.stringify(sortedVendors, null, 2) + '\n'
    await fs.writeFile(vendorsFilePath, vendorsString, 'utf-8')
  } catch (error) {
    console.error(`Error writing to file: ${error}`)
  }
}

sort()
