import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Archive, { type ArchiveTab } from "@/components/about/Archive";
import { pageMetadata } from "@/utils/seo";

export const metadata: Metadata = pageMetadata({
  title: "威爾森的生活札記 | 關於我",
  description: "出生自台中豐原的平凡小孩，內心永遠住著一個 15 歲的小屁孩。",
  path: "/about",
  image: "about",
});

// ───────── 要更新近況，改這裡就好 ─────────
const UPDATED = "2026.11";

const NOW = [
  { k: "在忙", v: "在實驗室裡做專案（雖然還是很菜鳥）" },
  { k: "想看", v: "想看的書跟電影真的超多，清單只會越來越長" },
];

const MUSIC: { when: string; artists: { name: string; href: string }[] }[] = [
  {
    when: "最近忽然喜歡上",
    artists: [
      { name: "Lady Gaga", href: "https://open.spotify.com/artist/1HY2Jd0NmPuamShAr6KMms" },
      { name: "Ariana Grande", href: "https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR" },
    ],
  },
  {
    when: "大二開始聽",
    artists: [
      { name: "あいみょん", href: "https://open.spotify.com/search/%E3%81%82%E3%81%84%E3%81%BF%E3%82%87%E3%82%93" },
    ],
  },
  {
    when: "高中時期",
    artists: [
      { name: "毛不易", href: "https://open.spotify.com/search/%E6%AF%9B%E4%B8%8D%E6%98%93" },
    ],
  },
];

// 收藏庫：書、歌、電影、劇。要加一本書／一首歌／一部片，在對應陣列加一筆就好
// 書封自架在 public/img/shelf/（來源博客來）；歌的 spotify 是 open.spotify.com/track/<id>；電影 tmdb 是 themoviedb.org/movie/<id>
const SPOTIFY_IMG = (h: string) => `https://i.scdn.co/image/${h}`;
const TMDB_IMG = (size: string, f: string) => `https://image.tmdb.org/t/p/${size}/${f}`;
const STILLS = (fs: string[]) => fs.map((f) => TMDB_IMG("w780", `${f}.jpg`));
const BOOK = (id: string) => ({ label: "博客來", url: `https://www.books.com.tw/products/${id}` });
const ARCHIVE: ArchiveTab[] = [
  { key: "books", kanji: "本", en: "BOOKS", items: [
    { title: "被討厭的勇氣", sub: "岸見一郎、古賀史健", img: "/img/shelf/courage.webp", src: BOOK("0010653153") },
    { title: "牧羊少年奇幻之旅", sub: "保羅・科爾賀", img: "/img/shelf/alchemist.webp", src: BOOK("0011067603") },
    { title: "三體", sub: "劉慈欣", img: "/img/shelf/three-body.webp", href: "/blog/three-body-1", note: "寫過一篇讀後心得", src: BOOK("0010950747") },
    { title: "我的神鬼人生", sub: "李家維、廖宏霖", img: "/img/shelf/shengui.webp", src: BOOK("0010973965") },
  ] },
  { key: "music", kanji: "音", en: "MUSIC", items: [
    { title: "W/X/Y", sub: "Tani Yuuki", spotify: "3ZnMe3b6WeuZislPMmCTZN", img: SPOTIFY_IMG("ab67616d00001e02e0d7f6e80ce383cb2ccef66d"), src: { label: "Spotify", url: "https://open.spotify.com/track/3ZnMe3b6WeuZislPMmCTZN" } },
    { title: "もう一度", sub: "Tani Yuuki", spotify: "40gt89icqkSFqWWfMlqagb", img: SPOTIFY_IMG("ab67616d00001e027d9d131027e15c39857682ce"), src: { label: "Spotify", url: "https://open.spotify.com/track/40gt89icqkSFqWWfMlqagb" } },
    { title: "スケッチ", sub: "あいみょん", spotify: "2HCw2hGOPVUim9RWk3wh0C", img: SPOTIFY_IMG("ab67616d00001e02ce2db1dfb891b878060d7cf3"), src: { label: "Spotify", url: "https://open.spotify.com/track/2HCw2hGOPVUim9RWk3wh0C" } },
    { title: "君の夢を聞きながら、僕は笑えるアイデアを！", sub: "あいみょん", spotify: "2SoUv5PuyA99w2XwwwQRST", img: SPOTIFY_IMG("ab67616d00001e02ac2aee5ac331309a79bc6e6a"), src: { label: "Spotify", url: "https://open.spotify.com/track/2SoUv5PuyA99w2XwwwQRST" } },
    { title: "Born This Way", sub: "Lady Gaga", spotify: "30XU4suKzCeoCK9YFzdufg", img: SPOTIFY_IMG("ab67616d00001e02a5d31644260279be8d0c46c0"), src: { label: "Spotify", url: "https://open.spotify.com/track/30XU4suKzCeoCK9YFzdufg" } },
    { title: "no tears left to cry", sub: "Ariana Grande", spotify: "2qT1uLXPVPzGgFOx4jtEuo", img: SPOTIFY_IMG("ab67616d00001e02c3af0c2355c24ed7023cd394"), src: { label: "Spotify", url: "https://open.spotify.com/track/2qT1uLXPVPzGgFOx4jtEuo" } },
    { title: "像我這樣的人", sub: "毛不易", spotify: "7pZYb3XtZ0wMtORwnVY9SE", img: SPOTIFY_IMG("ab67616d00001e024f11d50a19bd09efa1c1fbda"), src: { label: "Spotify", url: "https://open.spotify.com/track/7pZYb3XtZ0wMtORwnVY9SE" } },
    { title: "給你給我", sub: "毛不易", spotify: "0uIfbYtrvFEcueiw3GNFJt", img: SPOTIFY_IMG("ab67616d00001e024f11d50a19bd09efa1c1fbda"), src: { label: "Spotify", url: "https://open.spotify.com/track/0uIfbYtrvFEcueiw3GNFJt" } },
    { title: "平凡的一天", sub: "毛不易", spotify: "6RsXZQiT0Bhlo7tQefEbuW", img: SPOTIFY_IMG("ab67616d00001e024f11d50a19bd09efa1c1fbda"), src: { label: "Spotify", url: "https://open.spotify.com/track/6RsXZQiT0Bhlo7tQefEbuW" } },
    { title: "アオイ", sub: "サカナクション", spotify: "73TEyhGLxixHAwzOdoamgV", img: SPOTIFY_IMG("ab67616d00001e026dd4b6207e6e3780e50a24d6"), src: { label: "Spotify", url: "https://open.spotify.com/track/73TEyhGLxixHAwzOdoamgV" } },
    { title: "怪獣", sub: "サカナクション", spotify: "7sMRDjjwsB7wQEBOkdfg0i", img: SPOTIFY_IMG("ab67616d00001e022337f03620420d4561c7e6c9"), src: { label: "Spotify", url: "https://open.spotify.com/track/7sMRDjjwsB7wQEBOkdfg0i" } },
  ] },
  { key: "films", kanji: "映", en: "FILMS", items: [
    { title: "星際效應", sub: "", year: "2014", img: TMDB_IMG("w342", "v7Iib57HHgSEI9B7XYRF6qrs11T.jpg"), poster: TMDB_IMG("w500", "v7Iib57HHgSEI9B7XYRF6qrs11T.jpg"), stills: STILLS(["8sNiAPPYU14PUepFNeSNGUTiHW", "vgnoBSVzWAV9sNQUORaDGvDp7wx", "5XNQBqnBwPA9yT0jZ0p3s8bbLh0", "rAiYTfKGqDCRIIqo664sY9XZIvQ", "xJHokMbljvjADYdit5fK5VQsXEG"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/157336" } },
    { title: "奧德賽", sub: "", year: "2026", img: TMDB_IMG("w342", "d7MiRRamaAe58DacYEo2ZgziBBv.jpg"), poster: TMDB_IMG("w500", "d7MiRRamaAe58DacYEo2ZgziBBv.jpg"), stills: STILLS(["mIi99BK2mDpLp2lGsa8jCBDFit4", "twiVn9oFXOVR0uoYgawyEBlnFu8", "r57L2UBLPKcHdZQYg8tagv9XqK2", "bulFtfy3oBQtCnAMSi7g6DSSds3", "nVBzWBqHTB3XD0iqWiJLfKLo5fq"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1368337" } },
    { title: "陽光女子合唱團", sub: "", year: "2025", img: TMDB_IMG("w342", "ryCanTADyAo7bqRr1aca2ThuTeE.jpg"), poster: TMDB_IMG("w500", "ryCanTADyAo7bqRr1aca2ThuTeE.jpg"), stills: STILLS(["5K8zQhHIr6GiOIpM18DWsgy2COv", "8EaZzuA6DKAAJbWp6aTdIDzomg9", "21iGd9XfqAZJskCQNY1Nv70ksCH", "sWNSeqyxm7WouDFUDhedRPbRwvs", "lfk1PMzrtlSATGPljEpmqUUyUd5"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1481955" } },
    { title: "哆啦A夢：大雄的繪畫世界物語", sub: "", year: "2025", img: TMDB_IMG("w342", "puAxWoIq2AIEHsZpQZzOXng8JvC.jpg"), poster: TMDB_IMG("w500", "puAxWoIq2AIEHsZpQZzOXng8JvC.jpg"), stills: STILLS(["vncMpsAUDnL1JOb73e5q48gX32S", "yXew3YjJBAvSWL8ywXBHWtfWUdh", "ylNKb5f5n9yI8zSQVvqxxTCFZEP", "qfdeoOXbnMeoj6N3U3NWVzPcSnS", "oUcj5FUdAfUj21qk8B2ag2wMQa2"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1372489" } },
    { title: "哆啦A夢：新‧大雄的海底鬼岩城", sub: "", year: "2026", img: TMDB_IMG("w342", "a6j3pLB0P89TR7YkhD3k7MBkBqE.jpg"), poster: TMDB_IMG("w500", "a6j3pLB0P89TR7YkhD3k7MBkBqE.jpg"), stills: STILLS(["pxd9rc03EMMln3tVFdfd427Fpsi", "zzpZe99PfPH3dkMiYIuT1wT1BDO", "lBQ0vPp4FVFf5XeIFfD44BJNmLD", "zG3Ly3t14tdheBxvMl6aKwlX2Xr", "goqmKELqvF7PM3wV8R8fnbow5zz"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1542261" } },
    { title: "穿著PRADA的惡魔", sub: "", year: "2006", img: TMDB_IMG("w342", "he6k1x5nlGGhahh1xSyApU4fGeR.jpg"), poster: TMDB_IMG("w500", "he6k1x5nlGGhahh1xSyApU4fGeR.jpg"), stills: STILLS(["gkh6Nt8DtY1XT4gQsyFq9XAVJlJ", "CpLAfXgSNeNRRbRzPrTuzKmIHO", "3tWw50B1xXlCnJ9A7NX4nNzZF4j", "mpRU00GeyQixJ6OglFGlWiWV820", "fR5iqQDUVlGVMST26Jkf2m1Ngbu"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/350" } },
    { title: "穿著PRADA的惡魔2", sub: "", year: "2026", img: TMDB_IMG("w342", "pep61TOT2GJjT0ck2JbtMwIZNyJ.jpg"), poster: TMDB_IMG("w500", "pep61TOT2GJjT0ck2JbtMwIZNyJ.jpg"), stills: STILLS(["dRoFlUbH1l51ACmx5oPCI3jfvZq", "2cr7imTLVSSrzgL3bFKAMCMdgKw", "e5dglyzFNGvrcnddZxF4LJu5b4b", "y3fQa7pytlysovXzovpXc1OQlTW"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1314481" } },
    { title: "沙丘", sub: "", year: "2021", img: TMDB_IMG("w342", "qtSzr3bY8wP3lUDfTx2Qg5y5Qri.jpg"), poster: TMDB_IMG("w500", "qtSzr3bY8wP3lUDfTx2Qg5y5Qri.jpg"), stills: STILLS(["qVgZu5BTx6pu4owCvVOm4zjTfOi", "zRKQW58MBEY078AxkHxEJzUskCl", "jYEW5xZkZk2WTrdbMGAPFuBqbDc", "h3HsfV8Kn9Sz2QWUYYdP5ya23hx", "lzWHmYdfeFiMIY4JaMmtR7GEli3"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/438631" } },
    { title: "沙丘：第二部", sub: "", year: "2024", img: TMDB_IMG("w342", "1p25wDEdFRRTtwtPFbtPHISefzG.jpg"), poster: TMDB_IMG("w500", "1p25wDEdFRRTtwtPFbtPHISefzG.jpg"), stills: STILLS(["eZ239CUp1d6OryZEBPnO2n87gMG", "l6b9YZEokZl1nt7q0pprrur6btG", "24Ov8wnusgnzXwjV1eDm0Lzo5da", "xOMo8BRK7PfcJv9JCnx7s5hj0PX", "rRBD8ORo9y34tYkAQJVbn4Ml6tu"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/693134" } },
    { title: "Jim Queen：肌情四射", sub: "", year: "2026", img: TMDB_IMG("w342", "ue2Orwc7nNYFixoOLBHpse2H1uX.jpg"), poster: TMDB_IMG("w500", "ue2Orwc7nNYFixoOLBHpse2H1uX.jpg"), stills: STILLS(["gZDF8oChSplhdwTCjFR1SHwKw8s", "x6opAIx4h4JKBAMT4Wqf4Y2C93B", "ebAenpi5x9EwyQGCQU8KsvKKRql", "4GIqQTdnZl18QrMuIAWUcxoRBFy", "OxinPeJzoEOcZvet2Pnhzfp1xE"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1061798" } },
    { title: "動物方城市", sub: "", year: "2016", img: TMDB_IMG("w342", "rGZ6fQ7CPrExi1ox5SPMMhdvX1a.jpg"), poster: TMDB_IMG("w500", "rGZ6fQ7CPrExi1ox5SPMMhdvX1a.jpg"), stills: STILLS(["9tOkjBEiiGcaClgJFtwocStZvIT", "p2fRZzxla6NoRbIH2KOZq0gHb5S", "lgfoNa0kYgqDQC0k4xpGtY8Bw3r", "7A8xPRmiJV0Jp23gBqNkTOuYy4V", "lEQDD5ntxEVH85DLKSIOQ6M5Dlc"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/269149" } },
    { title: "動物方城市2", sub: "", year: "2025", img: TMDB_IMG("w342", "qKGxhmQb1IAdTF03mJTMuaLCLBo.jpg"), poster: TMDB_IMG("w500", "qKGxhmQb1IAdTF03mJTMuaLCLBo.jpg"), stills: STILLS(["lgotja3xMoJZbynwHfcQcJAEMWH", "5h2EsPKNDdB3MAtOk9MB9Ycg9Rz", "4I4KTPcFRvEQmQQ18Mx51rgxVMn", "7nfpkR9XsQ1lBNCXSSHxGV7Dkxe", "5BeOSbwt6BR7q2Fax70lF4AIshD"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1084242" } },
    { title: "海洋奇緣", sub: "", year: "2016", img: TMDB_IMG("w342", "zyldaLGUo7oZpI9Z1bYPg59uPQw.jpg"), poster: TMDB_IMG("w500", "zyldaLGUo7oZpI9Z1bYPg59uPQw.jpg"), stills: STILLS(["qLVNZFHYUR6Li64He67SWl6BHQe", "iYLKMV7PIBtFmtygRrhSiyzcVsF", "rPCvRf72tkMCao9mRT99DYJUZLE", "oWU6dgu3RgdSZElkhbZuoPtkWAJ", "dJ9wwB7MlOw0i9Omsz1Qb25WlqG"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/277834" } },
    { title: "海洋奇緣2", sub: "", year: "2024", img: TMDB_IMG("w342", "zKFLEeUTO0nGwcff5HPddwZPk1q.jpg"), poster: TMDB_IMG("w500", "zKFLEeUTO0nGwcff5HPddwZPk1q.jpg"), stills: STILLS(["vYqt6kb4lcF8wwqsMMaULkP9OEn", "zo8CIjJ2nfNOevqNajwMRO6Hwka", "tElnmtQ6yz1PjN1kePNl8yMSb59", "rVlwDjh8Fw8m6HVJR7KRWmRdPZl", "z6H78tQNcryTO4sgDjg8Knc6H9W"]), src: { label: "TMDB", url: "https://www.themoviedb.org/movie/1241982" } },
  ] },
  { key: "drama", kanji: "劇", en: "DRAMA", items: [
    { title: "如果我不曾見過太陽", sub: "", year: "2025", img: TMDB_IMG("w342", "rq3Zj093CdVXT47JeDfhGb6ogxQ.jpg"), poster: TMDB_IMG("w500", "rq3Zj093CdVXT47JeDfhGb6ogxQ.jpg"), stills: STILLS(["b9nrdh1VaspBckmaDwftW4mcOyC", "mTsft56kw9FpOBOeSv4Rx4Qly6a", "wYx2bYP0xlXlH5Du5XP6idJAqh2", "4IDPntce9HQyazyOFwaAzqqFZEv", "zA00C63k7aiZcM8ZpP38t9JNE1J"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/241576" } },
    { title: "影后", sub: "", year: "2024", img: TMDB_IMG("w342", "y0CGjq8HeFJZ5iPXiUEJDZpf9op.jpg"), poster: TMDB_IMG("w500", "y0CGjq8HeFJZ5iPXiUEJDZpf9op.jpg"), stills: STILLS(["pYppQQIDK9AJDSskRYZNqvSnpVu", "sYf17GmFslAVxRZuWqA7ho8abNw", "okgPPVPX1yjwVFOqaT7c7GVoKzj", "onvmuMqsaIfbl17XFHnKzhYaJap", "ahcU6La7NkY0GRbAEe27sUuERq1"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/245264" } },
    { title: "俗女養成記", sub: "", year: "2019", note: "第一、二季", img: TMDB_IMG("w342", "sHXT7wXvTttEsBaLVcpdrzBPuQi.jpg"), poster: TMDB_IMG("w500", "sHXT7wXvTttEsBaLVcpdrzBPuQi.jpg"), stills: STILLS(["v4oKm7cHJseFjlBjKmPCdj1PAZo", "6AxFWiVRRctvYDBywaVlDN6M3uR", "wdIJqry3xTD4uGeVnfOUJV0xLY0", "qKamtaAlj4kG5Dgxpry44bJs9I8"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/92925" } },
    { title: "回魂計", sub: "", year: "2025", img: TMDB_IMG("w342", "6IgMzHFDVFs26RAlT3CBd4lIsWy.jpg"), poster: TMDB_IMG("w500", "6IgMzHFDVFs26RAlT3CBd4lIsWy.jpg"), stills: STILLS(["h8sF926rL0b7zdMSWjo9rYiy3Lk", "hvSHnrbLlR829PqGdf1PXQZuDPb", "jDSmJFGCtb3rh8CxuIyqyGKYIK2", "3rbgGb4TUeeVq5HiIvU8hcE3x2d", "f2gw3a7wVQSEVoaSeWlxQkG0bro"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/252135" } },
    { title: "我的婆婆怎麼那麼可愛", sub: "", year: "2020", img: TMDB_IMG("w342", "mhdWP9lQvg66Ljbcl4QVtbnqVdp.jpg"), poster: TMDB_IMG("w500", "mhdWP9lQvg66Ljbcl4QVtbnqVdp.jpg"), stills: STILLS(["lJMLgj2EjWhezkRP5jHAL6Z16EH", "aUwvnqPXFkMIUbHDiJkZKKAhnuz"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/105269" } },
    { title: "鐵拳教育", sub: "", year: "2026", img: TMDB_IMG("w342", "1ZjaTxLcQsTZ9XmU5Nzpd3pBMHW.jpg"), poster: TMDB_IMG("w500", "1ZjaTxLcQsTZ9XmU5Nzpd3pBMHW.jpg"), stills: STILLS(["sGitHICLzIQQBiwE67lZLy6W67u", "vyG93jhmPL7tBIhRtCLa5mdBKob", "fOV6dJGG6EghbeXkU7RVQpDhFyp", "59RxNAp2OOQu01OQM1rjkdNECT8", "7I5o1pauNbi9fpp6Bq4OzRjaQfC"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/276161" } },
    { title: "我是遺物整理師", sub: "", year: "2021", img: TMDB_IMG("w342", "6DsOylD3a7NZGTd1uY8uMsK5Nbe.jpg"), poster: TMDB_IMG("w500", "6DsOylD3a7NZGTd1uY8uMsK5Nbe.jpg"), stills: STILLS(["tsdhmP9H7ZDveYDE0wkh90tjX3S", "bOxHzDenLU9T10MfZXdg5bXtQC1", "bFsEIKJu5CIO3WIdR3RZPK4nX8I", "6Igxzc3E6BWDm9fysGfPz7pni1P", "qoujIYdGNFhlHj851APJmNPz36A"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/96571" } },
    { title: "光陰的故事", sub: "", year: "2008", img: TMDB_IMG("w342", "t80mmXmq3P9A9893KCr1XaodBWx.jpg"), poster: TMDB_IMG("w500", "t80mmXmq3P9A9893KCr1XaodBWx.jpg"), stills: STILLS(["4Gk58iM9OVaoDk5QSUOYCtapUo7", "gA68xGVTLYb599VKfjnBQ8JF8zS"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/57162" } },
    { title: "三體（騰訊版）", sub: "", year: "2023", img: TMDB_IMG("w342", "q2sNliRi4j0ncXKUO1x0MldR20A.jpg"), poster: TMDB_IMG("w500", "q2sNliRi4j0ncXKUO1x0MldR20A.jpg"), stills: STILLS(["zxfBtHz5UmSTfIEC4O4GngyjHwa", "9JytHwIUnwIkm1pgDTE3b6HXB60", "bjH9oKKZAt28d3L6O7p4HyhurZD", "4cA6IoSm5NJ7538JSdWlMUlGQKY", "pdGCDDLCvjDTrVfsrlqdYZlPPh1"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/204541" } },
    { title: "3 體（Netflix）", sub: "", year: "2024", img: TMDB_IMG("w342", "yO6Yd5MR2QXyzoyHdZYR0ai5pxH.jpg"), poster: TMDB_IMG("w500", "yO6Yd5MR2QXyzoyHdZYR0ai5pxH.jpg"), stills: STILLS(["ciizJ9Okzt9tBBGK7Q3T14LFT2j", "bsQM8tL1HgkpNGqtotzz6iQ2NfT", "kSh5AfkJ38UqjbUvFrPQlvKNU0v", "u8FQAP59l29q1KptwJMnN8xdJre", "jtrBKhwBOLkq3XfiztaWTg7NoqN"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/108545" } },
    { title: "放課後的病歷表", sub: "", year: "2024", img: TMDB_IMG("w342", "wYy1c2EkYsNyt5QW8ZWgjTjXR7I.jpg"), poster: TMDB_IMG("w500", "wYy1c2EkYsNyt5QW8ZWgjTjXR7I.jpg"), stills: STILLS(["8ueIcC39li5WZrKOFdVgAd9DpfP"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/271360" } },
    { title: "浪漫速成班", sub: "", year: "2023", img: TMDB_IMG("w342", "2XhusUlXuOK3swfUO8mACiM1467.jpg"), poster: TMDB_IMG("w500", "2XhusUlXuOK3swfUO8mACiM1467.jpg"), stills: STILLS(["o3tS28maAJTDt9Zmnn4JvNv2Hix", "16M5khLLfZJCb2y9JlyujiGPPBQ", "exGBa2mjAWFRuHjPzKmBbXgSnOt", "8UVuv2TNv4w444TKa2hJ0lw8bLy", "v6uljyarnaWpePuldznKviIfx2N"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/202318" } },
    { title: "後宮甄嬛傳", sub: "", year: "2011", img: TMDB_IMG("w342", "2ucGJSsqgQ1XNKJiv7D3cFwir1r.jpg"), poster: TMDB_IMG("w500", "2ucGJSsqgQ1XNKJiv7D3cFwir1r.jpg"), stills: STILLS(["oaEIYMBx3IEtjWzyDyHu9MTtuv8", "c41yiFWQcJd1i8HLlyj8rEbeUcV", "ePFAvZJUficTSl8AOCZn5U0gfx8", "qoMQF9809QTi2dCoqG5J9pMQH2C", "dwVWrTDvv5cSOtmaf5ENFzM52Zb"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/50878" } },
    { title: "進擊的巨人", sub: "", year: "2013", img: TMDB_IMG("w342", "by4f66EHK82OZNyEuYbOW5RxFBa.jpg"), poster: TMDB_IMG("w500", "by4f66EHK82OZNyEuYbOW5RxFBa.jpg"), stills: STILLS(["rqbCbjB19amtOtFQbb3K2lgm2zv", "2b0s0iMNl9CgrCMz0VGKlMw3vZw", "wg0GsFpeHAFPbbcfsntTQBggWCo", "3T5N0Fg6hE3lE6JHJJPKrjtdI4j", "uACJw45EEkB5mfFw4SgMtgZgBBJ"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/1429" } },
    { title: "地。關於地球的運動", sub: "", year: "2024", img: TMDB_IMG("w342", "s1a9CYX3hUiDLzkyodZL3eCZzkC.jpg"), poster: TMDB_IMG("w500", "s1a9CYX3hUiDLzkyodZL3eCZzkC.jpg"), stills: STILLS(["o5GDX8zmKLpOxRkBoAonoQL8gbg", "7VV0rFVMFjztQgfEIeltGYWdtEf", "q9E0TTfc8uGzoH5jgfemAaz0vUD", "ojhGBPmpQLmBni5QQWDzwLRErzp"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/204635" } },
    { title: "槍彈辯駁", sub: "", year: "2013", note: "I／II／III 都看了", img: TMDB_IMG("w342", "2XKziwAUwPiOonJfSJxnEzFPNSU.jpg"), poster: TMDB_IMG("w500", "2XKziwAUwPiOonJfSJxnEzFPNSU.jpg"), stills: STILLS(["eAj5C3Sb4LCQReg3LMCnJ2wh45T", "fltHqeEzVbcCdHAjUGif34CvZyk", "kDAvpFwUZvGtRmjquusM6lwqkxd", "rLLlTSR0znm7ZYmL11XV0zPNeyF", "tMqaJBsJZ1jLBzOd4fTyfsPkpK9"]), src: { label: "TMDB", url: "https://www.themoviedb.org/tv/49471" } },
  ] },
];

// OC：住在威爾森內心深處的那隻狼
const MERIDIAN = [
  { k: "身分", v: "住在威爾森內心深處的投射，是他希望成為的完美角色（但其實也不完美 www）" },
  { k: "個性", v: "陽光、溫暖的大狗狗，熱愛旅行和探險" },
  { k: "年齡", v: "看起來 23 歲，其實才 15 歲" },
  { k: "生日", v: "不可知" },
  { k: "怪癖", v: "一隻不愛吃肉的狼；整天拿著地質錘到處找東西敲，有點破壞狂" },
  { k: "配色", v: "這個網站的深藍、米白、金、橘、青綠，都是從他身上取的" },
];

const LIKES = ["畫畫", "烹飪", "看劇", "看電影", "收藏書"];

const SECTIONS = [
  { href: "/blog", no: "01", label: "日常碎念", c: "var(--gold)" },
  { href: "/docs", no: "02", label: "學習日常", c: "var(--teal)" },
  { href: "/gallery", no: "03", label: "生活影像", c: "var(--orange)" },
  { href: "/map", no: "04", label: "足跡地圖", c: "var(--sage)" },
  { href: "/docs/research", no: "05", label: "研究", c: "var(--plum)" },
];

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono-label text-xs font-bold tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

export default function AboutPage() {
  return (
    <main className="px-6 py-10 md:px-12">
      <PageHeader code="[06] 來杯什麼都好の" title="關於我" en="ABOUT" color="var(--rose)" />

      <p className="max-w-3xl text-2xl font-black leading-relaxed md:text-3xl">
        出生自台中豐原的平凡小孩，
        <br className="max-sm:hidden" />
        內心永遠住著一個 <span className="about-mark">15 歲的小屁孩</span>。
      </p>

      <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_300px] md:gap-16">
        <div className="flex flex-col gap-12">
          <section>
            <Label>{"// 01 為什麼讀地科"}</Label>
            <div className="mt-3 border-t-4 border-foreground pt-4 text-lg leading-loose">
              原因真的很多，但最主要的是——
              <strong className="font-black">我想用不同的角度，好好看看這個我生活的世界。</strong>
            </div>
          </section>

          <section>
            <Label>{"// 02 喜歡的事"}</Label>
            <div className="mt-3 border-t-4 border-foreground pt-4">
              <ul className="flex flex-wrap gap-2">
                {LIKES.map((x) => (
                  <li key={x} className="border-2 border-foreground px-3 py-1 font-bold">
                    {x}
                  </li>
                ))}
              </ul>
              <p className="mt-4 leading-loose text-muted-foreground">
                畫畫、烹飪算是比較能直接聯想到的；特別喜歡看劇和電影。書的話比較偏收藏，假如有足夠多的時間，應該也算愛看書。
              </p>
            </div>
          </section>

          <section>
            <Label>{`// 03 近況（更新於 ${UPDATED}）`}</Label>
            <dl className="mt-3 border-t-4 border-foreground">
              {NOW.map((n) => (
                <div key={n.k} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-foreground/20 py-3">
                  <dt className="font-mono-label text-sm font-bold text-[var(--rose)]">{n.k}</dt>
                  <dd className="font-bold">{n.v}</dd>
                </div>
              ))}
              <div className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-foreground/20 py-3">
                <dt className="font-mono-label text-sm font-bold text-[var(--rose)]">在聽</dt>
                <dd className="flex flex-col gap-2">
                  {MUSIC.map((m) => (
                    <div key={m.when} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-sm text-muted-foreground">{m.when}</span>
                      {m.artists.map((a) => (
                        <a
                          key={a.name}
                          href={a.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline decoration-[var(--rose)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--rose)]"
                        >
                          {a.name} ↗
                        </a>
                      ))}
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </section>
          <section>
            <Label>{"// 04 住在心裡的那隻狼"}</Label>
            <div className="mt-3 grid gap-6 border-t-4 border-foreground pt-6 sm:grid-cols-[240px_minmax(0,1fr)]">
              <figure className="mx-auto w-60 sm:w-full">
                {/* 逐格動畫（6 格）；偏好減少動態時只顯示最後一格 */}
                <div className="relative">
                  <div
                    className="absolute inset-x-3 bottom-2 top-8 -skew-x-6 bg-[var(--navy)] dark:bg-[#2f3a5e]"
                    aria-hidden="true"
                  />
                  <picture>
                    <source srcSet="/img/meridian/hammer-still.webp" media="(prefers-reduced-motion: reduce)" />
                    <img
                      src="/img/meridian/hammer.webp"
                      alt="子午線 Meridian：戴圓框眼鏡和白色棒球帽的灰狼，揮地質錘敲石頭，敲下碎片後得意地笑"
                      width={480}
                      height={485}
                      loading="lazy"
                      className="relative block h-auto w-full"
                    />
                  </picture>
                </div>
                <figcaption className="mt-3 font-mono-label text-xs text-muted-foreground">
                  {"// 今天也在找東西敲"}
                </figcaption>
              </figure>
              <div>
                <p className="text-2xl font-black">
                  子午線 <span className="font-mono-label text-base text-muted-foreground">MERIDIAN</span>
                </p>
                <dl className="mt-3">
                  {MERIDIAN.map((m) => (
                    <div key={m.k} className="grid grid-cols-[3.5rem_1fr] gap-3 border-b border-foreground/20 py-2.5">
                      <dt className="font-mono-label text-sm font-bold text-[var(--rose)]">{m.k}</dt>
                      <dd className="text-sm font-bold leading-relaxed">{m.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section>
            <Label>{"// 05 收藏庫：讀過的、在聽的、看過的、追過的"}</Label>
            <Archive tabs={ARCHIVE} />
          </section>
        </div>

        <aside className="flex flex-col gap-10 md:sticky md:top-24 md:self-start">
          <div className="border-2 border-foreground p-5 shadow-[6px_6px_0_var(--rose)]">
            <p className="font-mono-label text-xs font-bold tracking-widest">ID CARD</p>
            <p className="mt-2 text-3xl font-black">威爾森</p>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-12 flex-none font-mono-label font-bold text-muted-foreground">來自</dt>
                <dd className="font-bold">台中豐原</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 flex-none font-mono-label font-bold text-muted-foreground">現在</dt>
                <dd className="font-bold">臺灣師範大學地球科學系</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 flex-none font-mono-label font-bold text-muted-foreground">找我</dt>
                <dd>
                  <a
                    href="https://instagram.com/sleepy__wilson"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline decoration-[var(--rose)] decoration-2 underline-offset-4 hover:text-[var(--rose)]"
                  >
                    IG @sleepy__wilson
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="網站分區">
            <Label>{"// 在這裡逛逛"}</Label>
            <ul className="mt-3 border-t-4 border-foreground">
              {SECTIONS.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="group flex items-center gap-3 border-b border-foreground/20 py-3 font-bold"
                  >
                    <span className="h-3 w-3 flex-none" style={{ background: s.c }} aria-hidden="true" />
                    <span className="font-mono-label text-xs text-muted-foreground">{s.no}</span>
                    <span className="split-hover">{s.label}</span>
                    <span className="ml-auto transition-transform group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </main>
  );
}
