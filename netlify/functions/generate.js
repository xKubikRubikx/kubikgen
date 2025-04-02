const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const prompt = body.prompt;

    const response = await fetch('https://api.fusionbrain.ai/api/v1/text2image/run', {
      method: 'POST',
      headers: {
        'X-Key': '3BEBC4F2ADA7A5B60C82F6CDD2F57862',
        'X-Secret': '2F923CB2EA5728408B8FF98DFF0C6649',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 1,
        prompt,
        num_images: 1,
        width: 512,
        height: 512
      })
    });

    const text = await response.text();
    if (!text) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Empty response from API" })
      };
    }

    const json = JSON.parse(text);
    return {
      statusCode: 200,
      body: JSON.stringify(json)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" })
    };
  }
};