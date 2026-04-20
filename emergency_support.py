import streamlit as st
import pandas as pd
import random

@st.cache_data
def generate_emergency_data(num_records=30):
    """Generate synthetic EV emergency technician data localized to Mumbai."""
    locations = ["Wadala", "Dadar", "Vashi", "Kamothe", "Panvel", "Andheri", "Bandra"]
    specialties = ["High-Voltage Repair", "Mobile Charging", "Battery Swap", "Towing Services", "Software Diagnostics"]
    statuses = ["Available", "Busy", "Off Duty"]

    data = []
    for i in range(num_records):
        data.append({
            "Service Name": f"EV Responder Alpha-{i+100}",
            "Specialty": random.choice(specialties),
            "Location": random.choice(locations),
            "Response Time (mins)": random.randint(10, 55),
            "Status": random.choices(statuses, weights=[0.5, 0.4, 0.1])[0],
            "Phone": f"+91 98{random.randint(10000000, 99999999)}"
        })
        
    # Sort by response time logically so quickest responders show up first implicitly
    df = pd.DataFrame(data).sort_values(by="Response Time (mins)")
    return df

def render_emergency_module():
    st.markdown("## 🚨 Emergency Response Network")
    st.markdown("<p style='color: #94a3b8;'>Rapid dispatch directory for High-Voltage verified mechanics and mobile charging fleet across the MMR region.</p>", unsafe_allow_html=True)
    
    df = generate_emergency_data(35)
    
    # UI Layout: Filter section
    col1, col2 = st.columns(2)
    with col1:
        locations = ["All"] + sorted(list(df['Location'].unique()))
        selected_location = st.selectbox("📍 Target Incident Zone", locations)
        
    with col2:
        specialties = sorted(list(df['Specialty'].unique()))
        selected_specialties = st.multiselect("🔧 Required Technician Specialty", specialties, default=[])
        
    # Filtering Logic Apply
    filtered_df = df.copy()
    if selected_location != "All":
        filtered_df = filtered_df[filtered_df['Location'] == selected_location]
        
    if len(selected_specialties) > 0:
        filtered_df = filtered_df[filtered_df['Specialty'].isin(selected_specialties)]
        
    st.markdown("<hr style='border-color: rgba(255,255,255,0.05); margin: 20px 0;'>", unsafe_allow_html=True)
    
    if len(filtered_df) == 0:
        st.warning("No operational units currently matching your specific criteria in this radius.")
        return
        
    # Display results as rich Contact Cards across a dynamic 3-column grid
    cols = st.columns(3)
    
    # Enumerate helps us cycle the columns easily: col_idx = i % 3
    for i, (_, row) in enumerate(filtered_df.iterrows()):
        if row["Status"] == "Available":
            status_color = "#10b981"
            display_status = "Available Now"
        elif row["Status"] == "Busy":
            status_color = "#f59e0b"
            display_status = "Busy - Est. Available in 45 mins"
        else:
            status_color = "#ef4444"
            display_status = row["Status"]
            
        # Clean phone number for tel: dialer protocol
        raw_phone = str(row['Phone']).replace(" ", "")
        
        card_start = f"""
        <div class="card" style="padding: 15px; margin-bottom: 20px; min-height: 180px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">
                <h3 style="margin: 0; padding: 0; border: none; font-size: 1.05rem; color: #f8fafc; flex: 1;">{row['Service Name']}</h3>
                <span style="background-color: {status_color}25; color: {status_color}; padding: 3px 8px; border-radius: 12px; font-size: 0.70rem; font-weight: 700; text-align: right; line-height: 1.2; max-width: 45%;">{display_status}</span>
            </div>
            <div style="margin: 5px 0; color: #cbd5e1; font-size: 0.9rem;"><strong>Specialty:</strong> <span style="color:#94a3b8;">{row['Specialty']}</span></div>
            <div style="margin: 5px 0; color: #cbd5e1; font-size: 0.9rem;"><strong>Coverage:</strong> <span style="color:#94a3b8;">{row['Location']}</span></div>
            <div style="margin: 5px 0; color: #cbd5e1; font-size: 0.9rem;"><strong>ETA:</strong> ⚡ <span style="color:#f8fafc; font-weight:600;">{row['Response Time (mins)']} mins</span></div>
            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: center;">
        """
        
        card_end = """
            </div>
        </div>
        """
        
        with cols[i % 3]:
            st.markdown(card_start, unsafe_allow_html=True)
            st.link_button("📞 Contact Technician", url=f"tel:{raw_phone}")
            st.markdown(card_end, unsafe_allow_html=True)
