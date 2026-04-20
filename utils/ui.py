import streamlit as st

def apply_custom_css():
    """Applies the Bloomberg x Apple premium custom CSS and hides default streamers."""
    st.markdown("""
    <style>
    /* Hide Streamlit default sidebar, header, and footer strictly */
    [data-testid="stSidebar"] { display: none !important; }
    [data-testid="collapsedControl"] { display: none !important; }
    header[data-testid="stHeader"] {display: none;}
    footer {display: none;}

    /* Bloomberg x Apple Dark Aesthetic / Vibrant Liquid Glass Background */
    /* Clean overrides scaling native Lightning Theme TOML bounds strictly */
    .stApp {
        color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    /* Override default main container padding completely */
    .block-container {
        padding-top: 1rem; 
        padding-bottom: 1rem; 
        max-width: 100%;
    }

    /* Headings */
    h1, h2, h3, h4, h5, h6 {
        color: #f8fafc;
        font-weight: 600;
        letter-spacing: -0.02em;
    }

    /* Premium Liquid Glass Containers */
    .card {
        padding: 12px;
        border-radius: 8px;
        background: rgba(10, 10, 15, 0.6) !important;
        backdrop-filter: blur(20px) saturate(150%) !important;
        -webkit-backdrop-filter: blur(20px) saturate(150%) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-top: 1px solid rgba(255, 255, 255, 0.2) !important;
        margin-bottom: 10px;
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.5) !important;
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    
    .card:hover {
        border-color: rgba(56, 189, 248, 0.3); /* subtle blue glow on hover */
        transform: translateY(-2px);
    }
    
    .card h3 {
        margin-top: 0;
        font-size: 0.85rem;
        color: #94a3b8;
        padding-bottom: 6px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .card h2 {
        font-size: 26px;
        margin: 6px 0 0 0;
        color: #38bdf8; /* Apple style accent blue */
        font-weight: 800;
    }

    </style>
    """, unsafe_allow_html=True)

def render_kpi_card(title: str, value: str):
    """Renders a stylish KPI Glass Card."""
    st.markdown(f"""
    <div class="card">
        <h3>{title}</h3>
        <h2>{value}</h2>
    </div>
    """, unsafe_allow_html=True)
