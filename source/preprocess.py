import pandas as pd


# US.txt preprocessing
df_US_zip = pd.read_csv("data/unprocessed/US_info.txt", sep='\t', header=None)

df_US_zip.columns = [
    'country', 'zip', 'city', 'state_name', 'state_abbr',
    'county', 'county_code', 'col_8', 'col_9',
    'latitude', 'longitude', 'col_12'
]

ca_zips = df_US_zip[df_US_zip['state_abbr'] == 'CA']

la_county_zips = ca_zips[ca_zips['county'].str.contains(
    'Los Angeles', case=False, na=False)]

la_zip_features = la_county_zips[['zip', 'city', 'latitude', 'longitude']]

la_city_zips = la_zip_features[la_zip_features['city'] == 'Los Angeles']

# zip, lat, long
la_city_zips_clean = la_city_zips.drop(['city'], axis=1)

# la_city_zips_clean.to_csv("data/processed/la_city_zips.csv", index=False)

# Parking citation preprocessing
df_parking_citations = pd.read_csv(
    "data/unprocessed/Parking_Citations.csv", header=0, nrows=10000)

df_parking_citations.drop(['make'], axis=1, inplace=True)

# Parking citation Zipcode addition
