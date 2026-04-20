import streamlit as st
import pandas as pd
from streamlit_option_menu import option_menu
from utils.ui import apply_custom_css, render_kpi_card
from market_data import render_market_module
from map_ui import render_map_module
from battery_ml import render_battery_module
from emergency_support import render_emergency_module

# ------------------ PAGE CONFIG ------------------
st.set_page_config(
    page_title="EV-RIT Terminal",
    layout="wide",
    initial_sidebar_state="collapsed"
)

import os
try:
    from supabase import create_client
except ImportError:
    create_client = None

# Apply global premium CSS
apply_custom_css()

# ------------------ ISOLATED PROFILE DROPDOWN ------------------
# This runs completely decoupled from Streamlit's internal routing and layouts
st.markdown("""
<style>
/* Reset any global CSS leaking to our dropdown */
.stApp {
    overflow-x: hidden;
}

#isolated-profile-btn {
    position: fixed;
    top: 15px;
    right: 25px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.profile-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #06b6d4, #2563eb);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    border: 2px solid rgba(255,255,255,0.1);
    transition: all 0.2s;
    user-select: none;
}

.profile-avatar:hover {
    border-color: rgba(6, 182, 212, 0.6);
    box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
}

.profile-panel {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    width: 200px;
    background: #000000;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.8);
    display: none; /* Hidden by default */
    flex-direction: column;
    overflow: hidden;
}

.profile-panel.open {
    display: flex;
}

#profile-toggle {
    display: none;
}

#profile-toggle:checked ~ #profile-panel-dropdown {
    display: flex;
}

.profile-item {
    padding: 12px 16px;

    color: #cbd5e1;
    text-decoration: none;
    font-size: 14px;
    display: block;
    transition: all 0.2s;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.profile-item:last-child {
    border-bottom: none;
}

.profile-item:hover {
    background: rgba(255,255,255,0.1);
    color: #38bdf8;
}

.profile-item.danger:hover {
    color: #f43f5e;
}
</style>

<div id="isolated-profile-btn">
    <label for="profile-toggle" class="profile-avatar" id="avatar-trigger" title="Open Profile Menu">
        👤
    </label>
    <input type="checkbox" id="profile-toggle">
    <div class="profile-panel" id="profile-panel-dropdown">
        <a href="http://localhost:3000/orders" class="profile-item" target="_blank">📦 Your Orders</a>
        <a href="http://localhost:3000/marketplace" class="profile-item" target="_blank">🛍️ EV Marketplace</a>
        <a href="http://localhost:3000/api/auth/signout?callbackUrl=/" class="profile-item danger">🚪 Sign Out</a>
    </div>
</div>
""", unsafe_allow_html=True)

# ------------------ SECURITY GATEKEEPER ------------------
query_params = st.query_params
if "user" not in query_params:
    st.toast("🌩️ Secure Guest Mode Activated", icon="⚡")
    user_email = "admin_session"
else:
    user_email = query_params["user"]

try:
    if create_client:
        supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
        supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
        if supabase_url and supabase_key:
            sb_client = create_client(supabase_url, supabase_key)
            sb_client.table("user_activity").insert([
                {
                    "email": user_email,
                    "event_type": "Entered Terminal",
                    "timestamp": pd.Timestamp.now().isoformat()
                }
            ]).execute()
except Exception as e:
    pass  # Silent fallback


# ------------------ HERO SECTION ------------------
st.markdown("""
<div style='text-align:center; padding: 0px;'>
    <h1 style='font-size:48px; margin-bottom: 0px; margin-top: 0px;'>&#9889; EV-RIT <span style="color: #38bdf8;">Terminal</span></h1>
    <p style='font-size:18px; color:#94a3b8; font-weight: 500; margin-bottom: 5px; margin-top: 8px;'>
    Real-Time EV Intelligence &amp; Infrastructure Analytics
    </p>
</div>
""", unsafe_allow_html=True)

# ------------------ NAVIGATION ------------------
menu = option_menu(
    menu_title=None,
    options=["Market Intelligence", "Infrastructure Map", "Battery AI", "Emergency Support"],
    icons=["graph-up-arrow", "map", "battery-half", "telephone"],
    default_index=0,
    orientation="horizontal",
    styles={
        "container": {
            "padding": "0!important",
            "background-color": "transparent",
            "margin-bottom": "0px",
            "margin-top": "0px",
            "border": "none"
        },
        "icon": {"color": "#a855f7", "font-size": "18px"},
        "nav-link": {
            "font-size": "15px",
            "text-align": "center",
            "margin": "0px 8px",
            "color": "#cbd5e1",
            "background-color": "rgba(255, 255, 255, 0.05)",
            "border-radius": "50px",
            "padding": "10px 20px",
            "backdrop-filter": "blur(10px)",
            "border": "1px solid rgba(255, 255, 255, 0.05)",
            "transition": "all 0.3s ease-in-out",
        },
        "nav-link:hover": {
            "background-color": "rgba(255, 255, 255, 0.12)",
            "border": "1px solid rgba(255, 255, 255, 0.2)",
            "transform": "scale(1.02)",
            "box-shadow": "0 0 15px rgba(255,255,255,0.05)"
        },
        "nav-link-selected": {
            "background-color": "rgba(6, 182, 212, 0.15)",
            "color": "#fff",
            "border": "1px solid #06b6d4",
            "box-shadow": "0 0 20px rgba(6, 182, 212, 0.5)",
        }
    }
)

# ------------------ GLOBAL KPIs ------------------
compressed_kpis = """
<div style="display: flex; justify-content: space-between; align-items: center; background: rgba(10,10,15,0.6); padding: 12px 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: -10px; margin-bottom: 25px; backdrop-filter: blur(20px);">
    <div style="text-align: center;"><span style="color:#94a3b8; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing: 1px;">&#128267; Lithium Index</span><br><span style="color:#38bdf8; font-size:22px; font-weight:800;">LIVE</span></div>
    <div style="text-align: center;"><span style="color:#94a3b8; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing: 1px;">&#9889; EV Stations</span><br><span style="color:#38bdf8; font-size:22px; font-weight:800;">12,024</span></div>
    <div style="text-align: center;"><span style="color:#94a3b8; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing: 1px;">&#128200; Market Growth</span><br><span style="color:#10B981; font-size:22px; font-weight:800;">+18.4%</span></div>
    <div style="text-align: center;"><span style="color:#94a3b8; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing: 1px;">&#127760; System Status</span><br><span style="color:#10B981; font-size:22px; font-weight:800;">ONLINE</span></div>
</div>
"""
st.markdown(compressed_kpis, unsafe_allow_html=True)


# ------------------ ROUTING ------------------
if menu == "Market Intelligence":
    render_market_module()

elif menu == "Infrastructure Map":
    render_map_module()

elif menu == "Battery AI":
    render_battery_module()

elif menu == "Emergency Support":
    render_emergency_module()

# ------------------ FOOTER ------------------
st.markdown("""
<div style='text-align: center; color: #475569; margin-top: 50px; padding: 20px; font-size: 0.9rem;'>
EV-RIT Intelligence Systems &#8226; Advanced AI Platform
</div>
""", unsafe_allow_html=True)