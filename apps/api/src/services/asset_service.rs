use crate::utils::usd_to_idr_convert::usd_to_idr_convert;

pub async fn get_latest_price(ticker: &str) -> Result<f64, Box<dyn std::error::Error>> {
    let provider = yahoo_finance_api::YahooConnector::new()?;

    let response = provider.get_latest_quotes(ticker, "1d").await?;

    let quote = response.last_quote()?;

    if ticker == "GC=F" {
        return Ok(usd_to_idr_convert(quote.close).await? / 31.1035);
    }

    let last_two = if ticker.len() >= 2 { &ticker[ticker.len() - 2..] } else { ticker };
    if last_two != "JK" {
        return Ok(usd_to_idr_convert(quote.close).await?);
    }

    Ok(quote.close)
}
