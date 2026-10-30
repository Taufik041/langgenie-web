export const API_BASE = "https://api.langgenie.ai";

export function snippets(model: "langgenie-od-od-v1" | "langgenie-od-en-v1" = "langgenie-od-od-v1") {
  const endpoint = model === "langgenie-od-od-v1" ? "speech-to-text" : "speech-translate";
  return [
    {
      label: "Python",
      code: `import requests

# ${model === "langgenie-od-od-v1" ? "Odia speech → Odia text" : "Odia speech → English text"}
response = requests.post(
    "${API_BASE}/v1/${endpoint}",
    headers={"api-subscription-key": "YOUR_API_KEY"},
    files={"file": open("sample.wav", "rb")},
    data={"model": "${model}", "with_timestamps": "true"},
)

print(response.json()["transcript"])`,
    },
    {
      label: "JavaScript",
      code: `const form = new FormData();
form.append("file", audioFile); // File or Blob
form.append("model", "${model}");

const res = await fetch("${API_BASE}/v1/${endpoint}", {
  method: "POST",
  headers: { "api-subscription-key": "YOUR_API_KEY" },
  body: form,
});

const { transcript } = await res.json();`,
    },
    {
      label: "cURL",
      code: `curl -X POST ${API_BASE}/v1/${endpoint} \\
  -H "api-subscription-key: YOUR_API_KEY" \\
  -F "file=@sample.wav" \\
  -F "model=${model}" \\
  -F "with_timestamps=true"`,
    },
  ];
}

export const sampleResponse = (model: "langgenie-od-od-v1" | "langgenie-od-en-v1") =>
  JSON.stringify(
    {
      request_id: "req_8f2c1e9a4b7d3a10",
      model,
      transcript:
        model === "langgenie-od-od-v1"
          ? "ନମସ୍କାର, ମୁଁ ଆଜି ମୋ ଜମିର ପଟ୍ଟା ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛି।"
          : "Hello, today I would like to know about the land record of my plot.",
      source_language: "od-IN",
      target_language: model === "langgenie-od-od-v1" ? "od-IN" : "en-IN",
      duration_seconds: 4.2,
      segments: [{ start: 0.0, end: 4.2, text: "…" }],
    },
    null,
    2
  );
