// GET /api/margin?code=7203 — 指定銘柄の信用残・株価レンジ・決算日を返す
const { getMargin } = require("../lib/kabu");
const { handlePreflight, sendJson } = require("./_cors");

module.exports = async (req, res) => {
  if (handlePreflight(req, res)) return;

  const url = new URL(req.url, "http://localhost");
  const code = (url.searchParams.get("code") || "").toUpperCase().trim();
  if (!/^[0-9A-Z]{4,5}$/.test(code)) {
    return sendJson(res, { error: "銘柄コードの形式が正しくありません" }, 400);
  }

  try {
    const data = await getMargin(code);
    return sendJson(res, data, data.error ? 404 : 200);
  } catch (err) {
    console.error(err);
    return sendJson(res, { error: "サーバー内部エラー: " + err.message }, 500);
  }
};
