pub async fn get_latest_price(ticker: &str) -> Result<f64, Box<dyn std::error::Error>> {
    let provider = yahoo_finance_api::YahooConnector::new()?;

    // Meminta data quote terbaru dengan rentang waktu 1 hari ("1d")
    let response = provider.get_latest_quotes(ticker, "1d").await?;

    // Mengekstrak quote terakhir dari respons Yahoo
    let quote = response.last_quote()?;

    // Mengembalikan harga penutupan (close)
    Ok(quote.close)
}
