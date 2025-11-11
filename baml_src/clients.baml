// Google Gemini Client Configuration
client<llm> Gemini {
  provider google-ai
  options {
    model "gemini-2.5-flash-preview-09-2025"  // Fast and cost-effective
    api_key env.GOOGLE_API_KEY
  }
}

// Alternative: Gemini Pro for more complex tasks
client<llm> GeminiPro {
  provider google-ai
  options {
    model "gemini-2.5-pro"
    api_key env.GOOGLE_API_KEY
  }
}
