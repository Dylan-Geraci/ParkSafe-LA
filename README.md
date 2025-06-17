# ParkSafe-LA

ParkSafe LA is a machine learning-based tool that helps drivers in Los Angeles estimate their risk of receiving a parking citation based on their location and time of day.

Using over 20 million real parking citation records issued in the City of LA, this project identifies patterns in violation types, enforcement timing, and geographic hotspots to predict whether a driver is likely to get a ticket at a given ZIP code and hour.

## 🔍 Why This Matters
Los Angeles issues millions of parking tickets each year — often concentrated in specific neighborhoods, time windows, and violation types. ParkSafe LA empowers users to:

    * Plan smarter parking decisions
    * Understand risk patterns in different ZIP codes
    * Learn how time and location affect enforcement

🗃️ Extracted Features
For this project, I extracted a focused subset of columns from the raw parking citation dataset to streamline preprocessing and modeling:

    issue_date – the date the citation was issued
    issue_time – the time (in HHMM format) the citation was issued
    make – the vehicle make (e.g., Toyota, Ford)
    violation_description – a textual description of the violation
    fine_amount – the amount of the citation in USD
    loc_long – longitude of where the citation occurred
    loc_lat – latitude of where the citation occurred
    violation_code – numeric violation code associated with the citation
These columns were used for cleaning, feature engineering, ZIP code mapping, and training the ML model to predict parking ticket risk.