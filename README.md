# ParkSafe-LA

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