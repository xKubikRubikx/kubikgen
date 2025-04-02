const fetch = require('node-fetch');

exports.handler = async function(event) {
  try {
    const body = JSON.parse(event.body || '{}');
    const prompt = body.prompt;

    // 1. Запрос генерации изображения
    const requestResponse = await fetch('https://api.fusionbrain.ai/api/v1/text2image', {
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

    const requestData = await requestResponse.json();

    if (!requestData.uuid) {
      console.error("UUID not received:", requestData);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Не удалось получить UUID генерации." })
      };
    }

    const uuid = requestData.uuid;

    // 2. Ждём и получаем результат
    let result = null;
    let attempts = 0;

    while (attempts < 10) {
      const statusResponse = await fetch(`https://api.fusionbrain.ai/api/v1/text2image/status/${uuid}`, {
        headers: {
          'X-Key': '3BEBC4F2ADA7A5B60C82F6CDD2F57862',
          'X-Secret': '2F923CB2EA5728408B8FF98DFF0C6649',
        }
      });

      const statusData = await statusResponse.json();

      if (statusData.images && statusData.images.length > 0) {
        result = statusData.images[0];
        break;
      }

      await new Promise(res => setTimeout(res, 1000));
      attempts++;
    }

    if (!result) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Генерация не завершилась вовремя." })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ image: result })
    };

  } catch (err) {
    console.error("FINAL GENERATION ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Unknown error" })
    };
  }
};