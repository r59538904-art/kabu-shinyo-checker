// GitHub Pages など別オリジンの画面から API を呼べるようにする共通処理。
// 参照系のみの公開データなので任意オリジンを許可する。

function applyCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // 信用残は週次更新。CDN 側で 10 分キャッシュして取得元への負荷を抑える。
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=600, stale-while-revalidate=3600");
}

// プリフライトなら true を返す (呼び出し側はそこで処理を終える)
function handlePreflight(req, res) {
  applyCors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  return false;
}

function sendJson(res, obj, status = 200) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

module.exports = { applyCors, handlePreflight, sendJson };
