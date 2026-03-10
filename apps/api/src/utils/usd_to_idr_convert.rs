pub async fn usd_to_idr_convert(usd_amount: f64) -> Result<f64, Box<dyn std::error::Error>> {
    let provider = yahoo_finance_api::YahooConnector::new()?;

    // Meminta quote terbaru untuk pasangan mata uang USD/IDR
    let response = provider.get_latest_quotes("USDIDR=X", "1d").await?;
    let quote = response.last_quote()?;

    Ok(quote.close * usd_amount)
}
