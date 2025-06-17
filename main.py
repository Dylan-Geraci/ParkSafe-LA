import pandas as pd

df = pd.read_csv("US.txt", sep='\t', header=None)


df.columns = [
    'country', 'zip', 'city', 'state_name', 'state_abbr',
    'county', 'county_code', 'col_8', 'col_9',
    'latitude', 'longitude', 'col_12'
]

ca_zips = df[df['state_abbr'] == 'CA']

la_zips = ca_zips[ca_zips['county'].str.contains(
    'Los Angeles', case=False, na=False)]

la_zip_centroids = la_zips[['zip', 'city', 'latitude', 'longitude']]

la_city_zips = la_zip_centroids[la_zip_centroids['city'] == 'Los Angeles']

print(la_city_zips.head(100))
