import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from utils.ui import render_kpi_card

class BatteryDegradationModel:
    """
    Mock Scikit-Learn style predictor for battery degradation.
    Designed to be seamlessly replaced with:
    
    self.model = joblib.load('battery_model.pkl')
    return self.model.predict(X)
    """
    def __init__(self):
        # Preprocessing mappings
        self.avg_ranges = {
            "Tata": 250.0,
            "MG": 350.0,
            "BYD": 450.0,
            "Tesla": 500.0
        }
        
    def preprocess(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocessing step bridging raw OEM details to chemical simulation features."""
        df = df.copy()
        # Feature Engineering: 1. Estimate Range 2. Calculate Cycles 
        df['Avg_Range'] = df['Manufacturer'].map(self.avg_ranges).fillna(300.0)
        df['Est_Cycles'] = df['Odometer'] / df['Avg_Range']
        return df

    def predict(self, features: pd.DataFrame) -> np.ndarray:
        """
        Expects a DataFrame with ['Manufacturer', 'Age', 'Odometer']
        Returns predicted State of Health (SoH) percentages.
        """
        processed_df = self.preprocess(features)
        
        cycles = processed_df['Est_Cycles'].values
        age = processed_df['Age'].values
        
        # Degradation logic: Physical cycling + Chemical aging interaction
        base_degradation = (cycles * 0.015) + (age * 1.5)
        
        soh = 100.0 - base_degradation
        return np.clip(soh, 0.0, 100.0)


def render_battery_module():
    st.markdown("## 🔋 Battery AI Prediction Hub")
    st.markdown("<p style='color: #94a3b8;'>Simulating OEM-specific battery degradation trajectories based on real-world mileage.</p>", unsafe_allow_html=True)
    
    col_input, col_viz = st.columns([1, 2])
    
    with col_input:
        st.markdown("<div class='card' style='padding:15px;'>", unsafe_allow_html=True)
        st.markdown("### 🎛️ Operational Parameters")
        
        manufacturers = ["Tata", "MG", "BYD", "Tesla"]
        manufacturer = st.selectbox("Battery Manufacturer", options=manufacturers)
        
        current_year = 2026
        year = st.number_input("Manufacturing Year", min_value=2010, max_value=current_year, value=2022, step=1)
        age = current_year - year
        
        odometer = st.number_input("Current Odometer Reading (km)", min_value=0, max_value=500000, value=45000, step=1000)
        
        st.markdown("</div>", unsafe_allow_html=True)
        
    # Initialize the Scikit-Learn style mock model
    model = BatteryDegradationModel()
    
    # Predict current state based on UI inputs
    current_features = pd.DataFrame({'Manufacturer': [manufacturer], 'Age': [age], 'Odometer': [odometer]})
    current_soh = model.predict(current_features)[0]
    
    # Calculate implicit driving behavior to map future age properly on the trajectory
    km_per_year = odometer / age if age > 0 else 15000.0
    if km_per_year == 0: km_per_year = 15000.0
    
    # Generate full trajectory curve for visualization (0 to 300,000 km)
    odo_range = np.linspace(0, 300000, 100)
    dynamic_age = odo_range / km_per_year
    
    trajectory_df = pd.DataFrame({
        'Manufacturer': manufacturer,
        'Age': dynamic_age,
        'Odometer': odo_range
    })
    
    # Predict trajectory
    trajectory_df['SoH'] = model.predict(trajectory_df)
    
    with col_viz:
        st.markdown("<div class='card' style='padding:15px;'>", unsafe_allow_html=True)
        
        # Display Current Prediction using a massive Plotly Gauge
        gauge_color = "#0ea5e9" if current_soh > 80 else "#f59e0b" if current_soh > 70 else "#ef4444"
        
        fig_gauge = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = current_soh,
            number = {'suffix': "%", 'font': {'color': gauge_color, 'size': 45, 'family': 'Arial Black'}},
            title = {'text': "Battery Current Health", 'font': {'color': '#94a3b8', 'size': 18}},
            gauge = {
                'axis': {'range': [0, 100], 'tickwidth': 1, 'tickcolor': "#94a3b8"},
                'bar': {'color': gauge_color, 'line': {'color': gauge_color, 'width': 2}},
                'bgcolor': "rgba(255, 255, 255, 0.05)",
                'borderwidth': 1,
                'bordercolor': "rgba(255, 255, 255, 0.1)",
                'steps': [
                    {'range': [0, 70], 'color': 'rgba(239, 68, 68, 0.15)'},
                    {'range': [70, 100], 'color': 'rgba(16, 185, 129, 0.05)'}],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.8,
                    'value': 70}
            }
        ))
        
        fig_gauge.update_layout(
            height=280, 
            margin=dict(l=30, r=30, t=50, b=10),
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#94a3b8')
        )
        
        st.plotly_chart(fig_gauge, use_container_width=True)
        
        st.markdown("<div style='height: 1px; background: rgba(255,255,255,0.05); margin: 5px 0 15px 0;'></div>", unsafe_allow_html=True)
        
        # Plot trajectory curve using Plotly
        fig = px.line(
            trajectory_df, 
            x='Odometer', 
            y='SoH', 
            title=f"Predicted Lifecycle Trajectory ({manufacturer})",
            labels={'SoH': 'State of Health (%)', 'Odometer': 'Total Mileage Odometer (km)'}
        )
        
        # Add End of Life threshold line at 70%
        fig.add_hline(y=70, line_dash="dash", line_color="#ef4444", annotation_text="End of Life (70%)", annotation_position="bottom left")
        
        # Add marker for current point on the line
        fig.add_scatter(x=[odometer], y=[current_soh], mode='markers', marker=dict(color="#38bdf8", size=14, line=dict(color='white', width=2)), name="Current Status")
        
        fig.update_layout(
            height=280, # Compressed cleanly enabling Gauge stacking
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#94a3b8',
            margin=dict(l=0, r=0, t=40, b=0),
            xaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.05)', linecolor='rgba(255,255,255,0.1)'),
            yaxis=dict(showgrid=True, gridcolor='rgba(255,255,255,0.05)', linecolor='rgba(255,255,255,0.1)', range=[40, 105]),
            showlegend=False
        )
        
        st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)
