// GitHub Pages など別オリジンの画面から API を呼べるようにする共通処理。
// 参照系のみの公開データなので任意オリジンを許可する。

function applyCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
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
  if (status === 200) {
    // 信用残は週次更新。CDN に 30 分持たせて取得元への負荷を減らしつつ、
    // 取得元がレート制限中でも stale-while-revalidate で1日ぶんは
    // 古い内容を返し続けられるようにする (画面が落ちない)。
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=1800, stale-while-revalidate=86400"
    );
  } else {
    // エラーはキャッシュしない (一時的な失敗が固定化されるのを防ぐ)
    res.setHeader("Cache-Control", "no-store");
  }
  res.end(JSON.stringify(obj));
}

module.exports = { applyCors, handlePreflight, sendJson };
