import pandas as pd


# US.txt preprocessing
US_zip_df = pd.read_csv("datasets/US.txt", sep='\t', header=None)

US_zip_df.columns = [
    'country', 'zip', 'city', 'state_name', 'state_abbr',
    'county', 'county_code', 'col_8', 'col_9',
    'latitude', 'longitude', 'col_12'
]

ca_zips = US_zip_df[US_zip_df['state_abbr'] == 'CA']

la_zips = ca_zips[ca_zips['county'].str.contains(
    'Los Angeles', case=False, na=False)]

la_zip_centroids = la_zips[['zip', 'city', 'latitude', 'longitude']]

la_city_zips = la_zip_centroids[la_zip_centroids['city'] == 'Los Angeles']

# zip, lat, long
la_city_zips_clean = la_city_zips.drop(['city'], axis=1)

print(la_city_zips_clean.head(5))

la_city_zips_clean.to_csv("data/raw/la_zip_centroids.csv", index=False)
