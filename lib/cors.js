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

// sMaxAge を渡すと CDN の保持時間を上書きできる (保存済みデータを返したときなど、
// 早めに取得し直したいケース用)。
function sendJson(res, obj, status = 200, sMaxAge = null) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (status === 200 && sMaxAge != null) {
    res.setHeader(
      "Cache-Control",
      `public, max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate=604800`
    );
  } else if (status === 200) {
    // 信用残は週1回しか更新されない。取得元へのアクセスを減らすことが
    // レート制限への一番の対策なので、CDN に長めに持たせる。
    //   s-maxage=3600            … 同じ銘柄への取得は最大でも1時間に1回
    //   stale-while-revalidate=7日 … 取得元が詰まっていても直近の内容を返し続ける
    // 副作用として現在値が最大1時間古くなるが、本題は週次の信用残なので許容する。
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=604800"
    );
  } else {
    // エラーはキャッシュしない (一時的な失敗が固定化されるのを防ぐ)
    res.setHeader("Cache-Control", "no-store");
  }
  res.end(JSON.stringify(obj));
}

module.exports = { applyCors, handlePreflight, sendJson };
