import streamlit as st
import sqlite3
import requests
import folium
import webbrowser
import math
from streamlit_folium import st_folium

# Database Connection
def connect_db():
    conn = sqlite3.connect('golf_analysis.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS shots (
        id INTEGER PRIMARY KEY,
        player_name TEXT,
        course TEXT,
        strackaline TEXT,
        location TEXT,
        distance REAL
    )''')
    conn.commit()
    return conn

# Calculate bearing between two points
def calculate_bearing(lat1, lon1, lat2, lon2):
    dLon = math.radians(lon2 - lon1)
    lat1 = math.radians(lat1)
    lat2 = math.radians(lat2)
    x = math.sin(dLon) * math.cos(lat2)
    y = math.cos(lat1) * math.sin(lat2) - math.sin(lat1) * math.cos(lat2) * math.cos(dLon)
    bearing = math.atan2(x, y)
    bearing = math.degrees(bearing)
    bearing = (bearing + 360) % 360
    return bearing

# Calculate new position given distance and bearing
def calculate_new_position(lat, lon, distance, bearing):
    R = 6371e3  # Earth radius in meters
    bearing = math.radians(bearing)
    lat = math.radians(lat)
    lon = math.radians(lon)

    lat2 = math.asin(math.sin(lat) * math.cos(distance / R) + math.cos(lat) * math.sin(distance / R) * math.cos(bearing))
    lon2 = lon + math.atan2(math.sin(bearing) * math.sin(distance / R) * math.cos(lat),
                            math.cos(distance / R) - math.sin(lat) * math.sin(lat2))

    lat2 = math.degrees(lat2)
    lon2 = math.degrees(lon2)
    return lat2, lon2

# Save Map as HTML and Open in Browser
def open_map_in_browser(m):
    map_filename = "predicted_shot_map.html"
    m.save(map_filename)
    webbrowser.open(map_filename)

# Streamlit App
st.title("Golf Player Swing Shot Analysis")

# Player Name
player_name = st.text_input("Enter Player Name:")

# Golf Course Selection
golf_courses = ["TPC Sawgrass"]
selected_course = st.selectbox("Select Golf Course:", golf_courses)

# Initial Hit Distance
hit_distance = st.number_input("Enter Estimated Hit Distance (in yards):", min_value=50, max_value=400)

# Strackaline Selection
strackalines = ["Front Tee", "Middle Tee", "Back Tee", "Championship Tee"]
selected_strackaline = st.selectbox("Select Strackaline:", strackalines)

# Hitting Location Input
hitting_location = st.text_input("Enter Hitting Location (Latitude, Longitude):")

# Hole Location Input
hole_location = st.text_input("Enter Hole Location (Latitude, Longitude):")

# TPC Sawgrass Hole 1 Boundary Coordinates
hole_1_boundary = [
    (30.194305, -81.393930),
    (30.194851, -81.393060),
    (30.195050, -81.392700),
    (30.195470, -81.392150),
    (30.195810, -81.391760),
    (30.196250, -81.391390),
    (30.196650, -81.391040),
    (30.197000, -81.390640),
    (30.197300, -81.390400),
    (30.197600, -81.390170),
    (30.197900, -81.389980),
    (30.198200, -81.389850),
    (30.198600, -81.389770)
]

# Display Map with Hole 1 Boundary
m = folium.Map(location=[30.194305, -81.393930], zoom_start=16)
folium.Polygon(locations=hole_1_boundary, color="blue", weight=3, fill=True, fill_opacity=0.2).add_to(m)

# Predict Shot Distance Button
if st.button("Predict Shot Distance"):
    try:
        hit_lat, hit_lon = map(float, hitting_location.split(','))
        hole_lat, hole_lon = map(float, hole_location.split(','))
        # Placeholder prediction logic
        predicted_distance = hit_distance + 10  # To be replaced with actual model
        # Convert distance from yards to meters
        distance_in_meters = predicted_distance * 0.9144
        # Calculate bearing
        bearing = calculate_bearing(hit_lat, hit_lon, hole_lat, hole_lon)
        # Calculate landing point based on distance and bearing
        landing_lat, landing_lon = calculate_new_position(hit_lat, hit_lon, distance_in_meters, bearing)
        # Update map with predicted landing circle instead of exact point
        folium.Marker([hit_lat, hit_lon], tooltip="Hitting Location", icon=folium.Icon(color='blue')).add_to(m)
        folium.Marker([hole_lat, hole_lon], tooltip="Hole Location", icon=folium.Icon(color='red')).add_to(m)
        folium.Circle(location=[landing_lat, landing_lon], radius=15, color="green", fill=True, fill_opacity=0.5, tooltip=f"Predicted Landing (Approx {predicted_distance} yards)").add_to(m)
        folium.PolyLine([(hit_lat, hit_lon), (landing_lat, landing_lon)], color="blue", weight=5, tooltip=f"{predicted_distance} yards").add_to(m)
        open_map_in_browser(m)
        st.success(f"Predicted Shot Distance: {predicted_distance} yards")

        # Save to Database
        conn = connect_db()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO shots (player_name, course, strackaline, location, distance) VALUES (?, ?, ?, ?, ?)",
                       (player_name, selected_course, selected_strackaline, hitting_location, predicted_distance))
        conn.commit()
        st.success("Data saved successfully!")
        conn.close()
    except ValueError:
        st.error("Invalid location format. Please enter as 'latitude,longitude'.")
