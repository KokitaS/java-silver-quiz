# 02 プリミティブ型・ラッパー・型変換・キャスト

> ひとことで言うと: 数値には「入れ物の大きさ」があり、小さい入れ物へ移すときは自分で `(型)` と書く。

読む目安: 8分 / 公式カテゴリ: 2 基本データ型・文字列

## 基本

### 8種類のプリミティブ型
| 型 | ビット | 初期値(フィールド) | 備考 |
|---|---|---|---|
| byte | 8 | 0 | -128〜127 |
| short | 16 | 0 | |
| int | 32 | 0 | 整数リテラルの標準 |
| long | 64 | 0L | `100L` |
| float | 32 | 0.0f | `3.14f` |
| double | 64 | 0.0 | 小数リテラルの標準 |
| char | 16 | `'\u0000'` | 文字だが数値としても扱える |
| boolean | - | false | 0/1 とは別物 |

- 荷物と箱で考える: 小さい箱(int)の中身は大きい箱(long)にそのまま移せる(**自動変換**)。逆は溢れる可能性があるので `(int)` と**自分で書く**(キャスト)。
- `3.14` は **double**。`float f = 3.14;` はコンパイルエラー。`3.14f` と書く。
- 数字リテラル: `1_000_000`(`_` OK)、`0x1F`(16進)、`0b101`(2進)、`017`(**8進**で15)。

```java
public class Main {
    public static void main(String[] args) {
        int i = 100;
        long l = i;              // 自動変換 OK
        double d = 9.99;
        int n = (int) d;         // 切り捨てで 9
        byte b = (byte) 300;     // 下位8ビットだけ残って 44
        System.out.println(l);
        System.out.println(n);
        System.out.println(b);
        System.out.println((byte) 255);
    }
}
// 出力: 100
// 出力: 9
// 出力: 44
// 出力: -1
```

### ラッパークラスとボクシング
| プリミティブ | ラッパー |
|---|---|
| int | Integer |
| char | Character |
| boolean | Boolean |

- `Integer i = 42;`(オートボクシング)、`int n = i;`(アンボクシング)は自動。
- `Integer x = null; int y = x;` は**実行時 NullPointerException**。
- `Integer` の `==` は -128〜127 ならキャッシュで同じオブジェクト(true)、128 以上は別オブジェクト(false)。値比較は `equals`。

## 試験のひっかけ

| ひっかけ | 正しい理解 |
|---|---|
| `float f = 3.14;` | コンパイルエラー(double → float は縮小) |
| `long l = 100;` | OK(int → long は拡大) |
| `int i = 5L;` | コンパイルエラー |
| `(int) 9.99` | **9**(四捨五入ではなく切り捨て) |
| `(byte) 300` | 44(エラーにならず下位ビットだけ残る) |
| `(byte) 255` | -1 |
| `Integer a = 127, b = 127; a == b` | true。128 なら false |
| `int x = nullのInteger` | 実行時 NullPointerException |
| `boolean b = 1;` | コンパイルエラー |

## 確認ミニ問題

**Q1.** コンパイルエラーになるのは?

1. `long l = 100;`
2. `float f = 3.14;`
3. `double d = 10;`
4. `char c = 65;`

<details><summary>答え</summary>

**2**。`3.14` は double なので float に入らない。4 の `char c = 65;` は定数が範囲内なので OK。

</details>

**Q2.** `System.out.println((int) 7.9);` の出力は?

1. 7
2. 8
3. 7.9
4. コンパイルエラー

<details><summary>答え</summary>

**1**。キャストは切り捨て。

</details>

**Q3.** `Integer a = 128; Integer b = 128;` のとき、`a == b` の結果は?

1. true
2. false
3. コンパイルエラー
4. 実行時エラー

<details><summary>答え</summary>

**2**。キャッシュは -128〜127 だけ。128 は別オブジェクトなので false。

</details>
