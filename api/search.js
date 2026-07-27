// GET /api/search?q=トヨタ — 銘柄名・コードの部分一致で候補を返す
const { searchStocks } = require("../lib/kabu");
const { handlePreflight, sendJson } = require("./_cors");

module.exports = async (req, res) => {
  if (handlePreflight(req, res)) return;

  const url = new URL(req.url, "http://localhost");
  const q = (url.searchParams.get("q") || "").trim();
  if (!q) return sendJson(res, { error: "検索語を入力してください" }, 400);

  try {
    const data = await searchStocks(q);
    return sendJson(res, data, data.error ? 502 : 200);
  } catch (err) {
    console.error(err);
    return sendJson(res, { error: "サーバー内部エラー: " + err.message }, 500);
  }
};
