# 燕舍 Yen House 官方網站 — 上線教學

> 這份教學是寫給**完全不懂程式**的人看的。
> 全程都在網頁上點滑鼠，不用買伺服器、不用裝任何軟體。
> 大約 30~40 分鐘可以完成，做完你的網站就真的上線了，有自己的網址。

---

## 你會得到什麼

- 一個前台官網網址（例如 `https://yenhouse.vercel.app`）
- 一個後台登入網址（`你的網址/admin/login`）
- 預設管理員帳號 **admin**、密碼 **admin123**（登入後請馬上改）
- 真正能登入、能改文字、能上傳圖片、能管理案例的後台
- 後台改了，前台馬上跟著變

---

## 開始前先準備（都免費）

你需要註冊 3 個免費網站帳號，建議用同一個 Email：

1. **GitHub** — 放程式碼的地方 👉 https://github.com
2. **Vercel** — 把網站變成網址的地方 👉 https://vercel.com
3. **Neon** — 免費資料庫 👉 https://neon.tech

三個都用「Sign up with GitHub」註冊最方便（用 GitHub 帳號一鍵登入）。

---

## 第 1 步：把程式碼放上 GitHub

1. 打開 https://github.com，登入。
2. 點右上角「+」→「New repository」。
3. Repository name 填 `yenhouse`，下面選 **Private**（私人），其他不用動，按綠色「Create repository」。
4. 進到新頁面後，找到「uploading an existing file」這行藍字，點它。
5. 把我給你的 **yenhouse 資料夾裡的所有檔案**，**全選拖進去**這個上傳區（可以直接把資料夾裡的東西拖進瀏覽器）。
   - ⚠️ 注意：要上傳的是「資料夾裡面的東西」，不是資料夾本身。打開資料夾，全選裡面的檔案再拖。
6. 等檔案都顯示出來後，最下面按綠色「Commit changes」。

✅ 完成後，你的程式碼就在 GitHub 上了。

---

## 第 2 步：建立免費資料庫（Neon）

1. 打開 https://neon.tech，用 GitHub 登入。
2. 它會問你建立 Project，名字隨便填（例如 `yenhouse`），地區選離台灣近的（如 Singapore），按建立。
3. 建好後，畫面上會有一個 **Connection string**（連線字串），長得像：
   ```
   postgresql://xxxx:xxxx@xxxx.neon.tech/xxxx?sslmode=require
   ```
4. 點旁邊的「複製」按鈕，把這整串**複製起來，先貼到記事本**，等一下要用。

✅ 這就是你的資料庫，免費版的容量對這個網站綽綽有餘。

---

## 第 3 步：部署到 Vercel（變成網址）

1. 打開 https://vercel.com，用 GitHub 登入。
2. 點「Add New...」→「Project」。
3. 找到剛剛上傳的 `yenhouse`，按它旁邊的「Import」。
4. **先別急著按 Deploy！** 往下找到「Environment Variables」（環境變數），這裡要填 3 個東西：

   | Name（名稱） | Value（值） |
   |---|---|
   | `DATABASE_URL` | 貼上第 2 步複製的那串連線字串 |
   | `AUTH_SECRET` | 隨便打一長串英數字，越亂越長越好（至少 32 個字元） |
   | `BLOB_READ_WRITE_TOKEN` | 先**留空**，第 5 步再回來填 |

   每填一個就按「Add」。
5. 都填好後，按最下面的「**Deploy**」。
6. 等大約 1~2 分鐘，看到撒花畫面就成功了！按「Continue to Dashboard」或直接看到你的網址。

✅ 點那個網址，你的前台官網就出現了！

---

## 第 4 步：放入預設資料（第一次必做）

剛部署完，資料庫是空的，要灌入預設內容（管理員帳號、四大服務等）。

1. 在 Vercel 專案頁面，上方點「Settings」→ 左邊找「Functions」附近沒有的話用下面更簡單的方法。

**最簡單的方法（推薦）：**

1. 在你的網站網址後面，先確認前台能開。
2. 回到 Vercel 專案頁，點上方「Deployments」→ 點最新那筆 →「⋯」→「Redeploy」。
   - 因為 `package.json` 裡的 build 指令已經自動建立資料表，所以資料表會自動產生。
3. 接著要灌入預設資料。最白話的做法：
   - 在電腦上，這需要跑一次種子指令。如果你完全不想碰指令，**直接聯絡我（或工程師）幫你跑一次 `npm run db:seed` 即可**，這一步只需做一次。

> 💡 如果你願意裝一個免費的東西：到 https://nodejs.org 下載安裝 Node.js，
> 然後把 GitHub 上的程式碼下載到電腦，在資料夾裡開「終端機」，
> 依序貼上這三行（每行按 Enter）：
> ```
> npm install
> 把 .env.example 改名成 .env 並填入你的 DATABASE_URL
> npm run db:seed
> ```
> 跑完就會看到「🎉 燕舍資料庫初始化完成！」，預設帳號和內容就進去了。

完成後，打開 `你的網址/admin/login`，用 **admin / admin123** 就能登入後台。

---

## 第 5 步：開啟圖片上傳功能（Vercel Blob）

如果你要在後台上傳圖片，需要這一步（不上傳圖片可跳過）：

1. 在 Vercel 專案頁面，上方點「Storage」。
2. 點「Create Database」→ 選「**Blob**」→ 按 Create。
3. 建好後它會自動把 `BLOB_READ_WRITE_TOKEN` 加到你的專案，**不用手動複製**。
4. 回到「Deployments」→ 最新一筆 →「Redeploy」重新部署一次，讓設定生效。

✅ 之後在後台「媒體檔案」就能真的上傳圖片，前台也讀得到了。

---

## 完成！你的網址

- 前台官網：`https://你的專案名.vercel.app`
- 後台登入：`https://你的專案名.vercel.app/admin/login`
- 帳號 `admin` / 密碼 `admin123`

---

## 之後你可以自己做的事

登入後台後，你可以隨時修改，改完前台立刻更新：

- **內容管理**：改 Hero 標題、關於燕舍、CTA 文案等所有文字
- **服務項目**：新增/編輯/刪除四大服務、調整順序、控制顯示
- **案例作品**：新增案例、上傳 Before/After 圖、分類
- **媒體檔案**：上傳、刪除圖片
- **聯絡資訊**：改 LINE、IG、FB、Threads、Email、電話

---

## 想換網域（例如 yenhouse.com）

1. 去網域商（GoDaddy、Gandi 等）買一個網域。
2. Vercel 專案 →「Settings」→「Domains」→ 輸入你的網域 → 照畫面指示設定。
3. 幾分鐘後就能用自己的網域開網站了。

---

## 修改管理員密碼

目前預設密碼是 admin123，建議盡快更換。最簡單的方式是請工程師協助，
或在本機跑一段小程式更新（密碼會用 bcrypt 加密儲存，不會明碼存放）。
未來版本可加入「後台改密碼」頁面，如有需要再告訴我。

---

## 常見問題

**Q：後台改了前台沒變？**
A：前台設定為動態讀取，重新整理即可。若用了 CDN 快取，等幾秒再刷新。

**Q：圖片上傳說「尚未設定圖片儲存」？**
A：請完成第 5 步建立 Vercel Blob 並重新部署。

**Q：登入一直跳回登入頁？**
A：確認 `AUTH_SECRET` 有設定，且資料庫已灌入 admin 帳號（第 4 步）。

**Q：完全卡住怎麼辦？**
A：把錯誤畫面截圖，連同你卡在第幾步，找工程師或回來問我，都能解決。

---

需要我幫你做「後台改密碼頁面」、「多語系」、「真實圖片素材整合」或「自訂網域設定」，再告訴我。
