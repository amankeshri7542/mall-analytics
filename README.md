# Mall Offline Brand Mapping

This project maps offline brands to malls based on store names found in mall directories. It processes a list of malls and a list of brands to identify which brands are present in which malls.

## Project Description

The goal of this task is to match a list of "offline" brands (provided in a CSV file) against a database of malls (provided in a JSON file). Each mall has a directory of stores. The script iterates through the malls and attempts to find matches for the brands within the mall's directory.

### Key Features:
- **Data Loading**: Loads mall data from JSON and brand data from CSV.
- **Normalization**: Cleans brand names by removing common suffixes (e.g., "Instant Voucher", "eGift Card") and handles case-insensitive matching.
- **Matching Logic**: Uses regular expressions to match cleaned brand names against store names in the mall directories. It supports whole-word matching to avoid partial matches where appropriate.
- **Output Generation**: Produces a JSON file containing the mapping of malls to the brands found within them.

## Prerequisites

- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amankeshri7542/mall-analytics.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Recipto-Task
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To run the mapping script:

```bash
node src/index.js
```

The script will:
1. Load mall data from `data/1252_malls_final (2).json`
2. Load brand data from `data/Offlinedump-new(Sheet1).csv`
3. Process the data and match brands to malls.
4. Save the results to:
   - `output/final_mall_data.json`
   - `output/final_mall_data.js`

## File Structure

- `src/index.js`: Main entry point. Handles data loading, processing, and output.
- `src/utils/dataLoader.js`: Utility functions to load JSON and CSV data.
- `src/utils/normalizer.js`: Utility functions for string normalization and brand name cleaning.
- `data/`: Contains input data files (malls JSON and brands CSV).
- `output/`: Generated output files.

## Logic Details

1. **Brand Cleaning**: Brand names are stripped of suffixes like " - Luxe", " Instant Voucher", etc., to improve matching accuracy against store names which typically don't include these suffixes.
2. **Matching**: A case-insensitive regex search is performed. If a brand name starts or ends with a word character, word boundaries (`\b`) are used to ensure exact word matches (e.g., matching "GAP" but not "Singapore").
3. **Deduplication**: Brands found in a mall are stored in a Map to prevent duplicate entries for the same brand in the same mall.

## License

ISC
