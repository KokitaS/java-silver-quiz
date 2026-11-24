# 11 for・while・do-while・break・continue

> ひとことで言うと: `break` は「ループを抜ける」、`continue` は「今回の残りを飛ばして次へ」。内側のループだけが対象。

読む目安: 7分 / 公式カテゴリ: 3 演算子・制御構造

## 基本

### 3種類のループ
| 種類 | 特徴 |
|---|---|
| `for (初期化; 条件; 更新)` | 回数が決まっているとき |
| `while (条件)` | 条件を**先に**チェック。0回もある |
| `do { } while (条件);` | **必ず1回は実行**してから条件をチェック(最後に `;` が必要) |
| 拡張 for `for (T x : 配列/リスト)` | 順に全部取り出す |

```java
public class Main {
    public static void main(String[] args) {
        int i = 5;
        do {
            System.out.println("run " + i);
        } while (i < 3);               // 条件は false だが 1回は実行される

        for (int k = 0; k < 5; k++) {
            if (k == 1) continue;      // k=1 のときだけ飛ばす
            if (k == 3) break;         // k=3 でループを抜ける
            System.out.println(k);
        }
    }
}
// 出力: run 5
// 出力: 0
// 出力: 2
```

### break / continue とラベル
- 普通の `break` は**一番内側の**ループ(または switch)だけ抜ける。
- 外側ごと抜けたいときは**ラベル**: `outer: for (...) { for (...) { break outer; } }`。

```java
public class Main {
    public static void main(String[] args) {
        outer:
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (j == 1) continue outer;      // 外側の次の周へ
                System.out.println(i + "," + j);
            }
        }
    }
}
// 出力: 0,0
// 出力: 1,0
// 出力: 2,0
```

### ループ変数と到達不能コード
- `for (int i = 0; ...)` の `i` は**ループの中だけ**で有効。外で使うとコンパイルエラー。
- `for (;;)` や `while (true)` は無限ループ。`break` がないと、その**後ろに書いた文はコンパイルエラー**(到達不能)。
- `while (false) { ... }` の中身も到達不能でコンパイルエラー。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `do { } while (false)` | 1回実行される |
| 二重ループの `break` | 内側だけ抜ける |
| `for` の `i` をループ後に使う | コンパイルエラー |
| `while (true) { }` の次の行 | コンパイルエラー(到達不能) |
| `do { } while (x < 3)` の末尾 | `;` が必要 |
| 拡張 for の変数への代入 | 元の配列/リストは変わらない(コピーを見ているだけ) |

## 確認ミニ問題

**Q1.** 出力は?
```java
for (int i = 0; i < 4; i++) {
    if (i == 2) continue;
    System.out.print(i);
}
```
1. `013`
2. `01`
3. `0123`
4. `0134`

<details><summary>答え</summary>

**1**。i=2 のときだけ飛ばして `0`、`1`、`3`。

</details>

**Q2.** 出力は?
```java
int n = 10;
do {
    System.out.print("x");
} while (n < 5);
```
1. 何も出力されない
2. `x`
3. `xx`
4. コンパイルエラー

<details><summary>答え</summary>

**2**。do-while は条件を後で見るので、必ず1回は実行される。

</details>

**Q3.** 次のコードの結果は?
```java
while (true) {
    System.out.println("loop");
    break;
}
System.out.println("end");
```
1. `loop` のみ出力
2. `loop` と `end` が出力
3. 無限ループ
4. コンパイルエラー

<details><summary>答え</summary>

**2**。`break` があるので、後ろの文に到達できる。

</details>
