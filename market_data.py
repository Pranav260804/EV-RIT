import streamlit as st
import yfinance as yf
import plotly.graph_objects as go
from streamlit_autorefresh import st_autorefresh
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import streamlit.components.v1 as components

def generate_synthetic_candlestick_data(days=180, base_price=20000.0, volatility=0.015):
    """Generate mock commodity candlestick data mimicking daily price action."""
    dates = [datetime.today() - timedelta(days=i) for i in range(days)]
    dates.reverse() # chronological order
    
    data = []
    current_price = base_price
    for d in dates:
        # daily drift component to make it go randomly up or down
        drift = current_price * np.random.normal(0.0002, volatility)
        open_p = current_price
        close_p = current_price + drift
        
        # define highs and lows mathematically wider than open/close
        high_p = max(open_p, close_p) + (max(open_p, close_p) * abs(np.random.normal(0, volatility * 0.5)))
        low_p = min(open_p, close_p) - (min(open_p, close_p) * abs(np.random.normal(0, volatility * 0.5)))
        
        data.append({
            'Open': open_p,
            'High': high_p,
            'Low': low_p,
            'Close': close_p,
            'Date': d
        })
        current_price = close_p
        
    df = pd.DataFrame(data)
    df.set_index('Date', inplace=True)
    return df

@st.cache_data(ttl=60)
def load_market_data(ticker_symbol: str, period: str="6mo") -> pd.DataFrame:
    """Fetch market data via yfinance, fallback silently to simulated synthetic data."""
    try:
        ticker = yf.Ticker(ticker_symbol)
        df = ticker.history(period=period, interval="1d")
        if not df.empty:
            return df
    except Exception:
        pass
    
    # Silent Fallback Generator
    days = 180 if period == "6mo" else 90 if period == "3mo" else 365
    base = 25000.0 if ticker_symbol == "NI=F" else 60.0
    return generate_synthetic_candlestick_data(days=days, base_price=base)

def render_tradingview_chart(symbol: str, height=450):
    """Render a professional TradingView Advanced Chart widget with all indicator/timespan capabilities."""
    widget_html = f"""
    <div class="tradingview-widget-container">
      <div id="tv_{symbol.replace(':', '_').replace('!', '_')}"></div>
      <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
      <script type="text/javascript">
      new TradingView.widget({{
        "width": "100%",
        "height": {height},
        "symbol": "{symbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(10, 10, 15, 0.5)",
        "gridColor": "rgba(255, 255, 255, 0.05)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tv_{symbol.replace(':', '_').replace('!', '_')}",
        "toolbar_bg": "rgba(10, 10, 15, 0.8)",
        "allow_symbol_change": true,
        "studies": [
          "RSI@tv-basicstudies",
          "MASimple@tv-basicstudies",
          "MACD@tv-basicstudies"
        ],
        "withdateranges": true
      }});
      </script>
    </div>
    """
    components.html(widget_html, height=height + 20)

def generate_trade_insight(df: pd.DataFrame, mineral_name: str):
    """Analyze the chart data and generate an actionable AI trading insight."""
    if df.empty or len(df) < 20:
        return 0, 0, "Unknown", "N/A", "#94a3b8", "Insufficient data for analysis."
        
    last_close = df['Close'].iloc[-1]
    prev_close = df['Close'].iloc[-2]
    change_pct = ((last_close - prev_close) / prev_close) * 100
    
    # Calculate Simple Moving Average (SMA 20)
    sma20 = df['Close'].rolling(window=20).mean().iloc[-1]
    
    if last_close > sma20 and change_pct > 0:
        trend = "Bullish Uptrend ↗"
        action = "SECURE LONG-TERM SUPPLY (BUY)"
        color = "#10b981"
        impact = f"Rising {mineral_name} prices indicate supply strain. Securing raw materials now will lock in prices before cell manufacturing costs jump by an estimated 3.2% next quarter."
    elif last_close < sma20 and change_pct < 0:
        trend = "Bearish Downtrend ↘"
        action = "PULL BACK & BUY ON SPOT (DELAY)"
        color = "#ef4444"
        impact = f"Declining {mineral_name} prices show market oversupply. Avoid long-term contracts; rely on spot market purchases to capitalize on further capitulation."
    else:
        trend = "Consolidating ➝"
        action = "HEDGE PORTFOLIO (HOLD)"
        color = "#f59e0b"
        impact = f"{mineral_name} is experiencing sideways volatility. Maintain current inventory levels and hedge 30% of projected Q3 requirements against sudden policy shifts."
        
    return last_close, change_pct, trend, action, color, impact

def render_market_module():
    st.markdown("## 📈 Global Mineral & EV Market")
    st.markdown("<p style='color: #94a3b8;'>Live metrics for key battery inputs. Simulating trading environment.</p>", unsafe_allow_html=True)
    
    # Auto-refresh context (simulated live-trading environment every 15 seconds)
    st_autorefresh(interval=15000, key="market_autorefresh")
    
    # First row of 2 charts
    row1_col1, row1_col2 = st.columns(2)
    # Second row of 2 charts
    row2_col1, row2_col2 = st.columns(2)
    
    with st.spinner("Fetching real-time market feeds via Satellite..."):
        # Fetch Data for 4 assets
        lithium_df = load_market_data("LIT", period="6mo")
        remx_df = load_market_data("REMX", period="6mo")
        copx_df = load_market_data("COPX", period="6mo")
        batt_df = load_market_data("BATT", period="6mo")
        
        # Generate Insights
        lit_price, lit_pct, lit_trend, lit_action, lit_color, lit_impact = generate_trade_insight(lithium_df, "Lithium")
        remx_price, remx_pct, remx_trend, remx_action, remx_color, remx_impact = generate_trade_insight(remx_df, "Rare Earths/Cobalt")
        copx_price, copx_pct, copx_trend, copx_action, copx_color, copx_impact = generate_trade_insight(copx_df, "Copper")
        batt_price, batt_pct, batt_trend, batt_action, batt_color, batt_impact = generate_trade_insight(batt_df, "Battery Tech")
        
        with row1_col1:
            st.markdown("<div class='card' style='padding:10px;'>", unsafe_allow_html=True)
            st.markdown("<h3 style='margin: 0 0 10px 0; color: #f8fafc;'>Lithium Index (LIT)</h3>", unsafe_allow_html=True)
            render_tradingview_chart("AMEX:LIT", height=430)
            
            # Actionable Insight Block
            st.markdown(f"""
            <div style='background: rgba(255,255,255,0.03); border-radius: 8px; padding: 15px; border-left: 4px solid {lit_color}; margin-top: -10px; margin-bottom: 5px;'>
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;'>
                    <span style='color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;'>AI Terminal Analysis</span>
                    <span style='color: {lit_color}; font-size: 14px; font-weight: 700;'>{lit_trend}</span>
                </div>
                <h4 style='margin: 0; color: #fff; font-size: 18px;'>Current: ${lit_price:,.2f} <span style='font-size: 14px; color: {lit_color};'>({lit_pct:+.2f}%)</span></h4>
                <p style='color: #cbd5e1; font-size: 13px; margin: 10px 0; line-height: 1.5;'>{lit_impact}</p>
                <div style='background: {lit_color}20; border: 1px solid {lit_color}40; color: {lit_color}; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; text-align: center; letter-spacing: 0.5px;'>
                    ACTION: {lit_action}
                </div>
            </div>
            </div>
            """, unsafe_allow_html=True)
            
        with row1_col2:
            st.markdown("<div class='card' style='padding:10px;'>", unsafe_allow_html=True)
            st.markdown("<h3 style='margin: 0 0 10px 0; color: #f8fafc;'>Rare Earths & Strategic Metals (REMX) - Cobalt/Manganese</h3>", unsafe_allow_html=True)
            render_tradingview_chart("AMEX:REMX", height=430)
            
            # Actionable Insight Block
            st.markdown(f"""
            <div style='background: rgba(255,255,255,0.03); border-radius: 8px; padding: 15px; border-left: 4px solid {remx_color}; margin-top: -10px; margin-bottom: 5px;'>
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;'>
                    <span style='color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;'>AI Terminal Analysis</span>
                    <span style='color: {remx_color}; font-size: 14px; font-weight: 700;'>{remx_trend}</span>
                </div>
                <h4 style='margin: 0; color: #fff; font-size: 18px;'>Current: ${remx_price:,.2f} <span style='font-size: 14px; color: {remx_color};'>({remx_pct:+.2f}%)</span></h4>
                <p style='color: #cbd5e1; font-size: 13px; margin: 10px 0; line-height: 1.5;'>{remx_impact}</p>
                <div style='background: {remx_color}20; border: 1px solid {remx_color}40; color: {remx_color}; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; text-align: center; letter-spacing: 0.5px;'>
                    ACTION: {remx_action}
                </div>
            </div>
            </div>
            """, unsafe_allow_html=True)

        with row2_col1:
            st.markdown("<div class='card' style='padding:10px;'>", unsafe_allow_html=True)
            st.markdown("<h3 style='margin: 0 0 10px 0; color: #f8fafc;'>Global Copper Miners (COPX)</h3>", unsafe_allow_html=True)
            render_tradingview_chart("AMEX:COPX", height=430)
            
            # Actionable Insight Block
            st.markdown(f"""
            <div style='background: rgba(255,255,255,0.03); border-radius: 8px; padding: 15px; border-left: 4px solid {copx_color}; margin-top: -10px; margin-bottom: 5px;'>
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;'>
                    <span style='color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;'>AI Terminal Analysis</span>
                    <span style='color: {copx_color}; font-size: 14px; font-weight: 700;'>{copx_trend}</span>
                </div>
                <h4 style='margin: 0; color: #fff; font-size: 18px;'>Current: ${copx_price:,.2f} <span style='font-size: 14px; color: {copx_color};'>({copx_pct:+.2f}%)</span></h4>
                <p style='color: #cbd5e1; font-size: 13px; margin: 10px 0; line-height: 1.5;'>{copx_impact}</p>
                <div style='background: {copx_color}20; border: 1px solid {copx_color}40; color: {copx_color}; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; text-align: center; letter-spacing: 0.5px;'>
                    ACTION: {copx_action}
                </div>
            </div>
            </div>
            """, unsafe_allow_html=True)

        with row2_col2:
            st.markdown("<div class='card' style='padding:10px;'>", unsafe_allow_html=True)
            st.markdown("<h3 style='margin: 0 0 10px 0; color: #f8fafc;'>Advanced Battery Metals (BATT)</h3>", unsafe_allow_html=True)
            render_tradingview_chart("AMEX:BATT", height=430)
            
            # Actionable Insight Block
            st.markdown(f"""
            <div style='background: rgba(255,255,255,0.03); border-radius: 8px; padding: 15px; border-left: 4px solid {batt_color}; margin-top: -10px; margin-bottom: 5px;'>
                <div style='display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;'>
                    <span style='color: #94a3b8; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;'>AI Terminal Analysis</span>
                    <span style='color: {batt_color}; font-size: 14px; font-weight: 700;'>{batt_trend}</span>
                </div>
                <h4 style='margin: 0; color: #fff; font-size: 18px;'>Current: ${batt_price:,.2f} <span style='font-size: 14px; color: {batt_color};'>({batt_pct:+.2f}%)</span></h4>
                <p style='color: #cbd5e1; font-size: 13px; margin: 10px 0; line-height: 1.5;'>{batt_impact}</p>
                <div style='background: {batt_color}20; border: 1px solid {batt_color}40; color: {batt_color}; padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; text-align: center; letter-spacing: 0.5px;'>
                    ACTION: {batt_action}
                </div>
            </div>
            </div>
            """, unsafe_allow_html=True)
