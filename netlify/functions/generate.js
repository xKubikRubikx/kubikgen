
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const API_KEY = "3BEBC4F2ADA7A5B60C82F6CDD2F57862";
  const SECRET = "2F923CB2EA5728408B8FF98DFF0C6649";

  if (event.httpMethod === "POST") {
    const { prompt } = JSON.parse(event.body);

    const res = await fetch("https://fusionbrain.ai/api/v1/text2image/run", {
      method: "POST",
      headers: {
        "X-Key": "API_KEY:" + API_KEY,
        "X-Secret": "SECRET_KEY:" + SECRET,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model_id: 1,
        num_images: 1,
        width: 1024,
        height: 1024,
        text: prompt
      })
    });

    const data = await res.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  }

  if (event.httpMethod === "GET" && event.queryStringParameters.uuid) {
    const uuid = event.queryStringParameters.uuid;

    const res = await fetch("https://fusionbrain.ai/api/v1/text2image/status/" + uuid, {
      method: "GET",
      headers: {
        "X-Key": "API_KEY:" + API_KEY,
        "X-Secret": "SECRET_KEY:" + SECRET
      }
    });

    const data = await res.json();
    const image = data.images && data.images.length > 0 ? "https://fusionbrain.ai" + data.images[0] : null;
    return {
      statusCode: 200,
      body: JSON.stringify({ image })
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ error: "Bad request" })
  };
};
